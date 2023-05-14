from flask import Flask, request, jsonify, Response
import pandas as pd
from flask_cors import CORS
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV, TimeSeriesSplit
from sklearn.metrics import r2_score

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def upload():
    file = request.files['csvFile']
    if file.filename == '':
        return 'No file selected'

    file.save(file.filename)
    print("File saved successfully")

    periodicity = request.form['periodicity']
    periods = int(request.form['periods'])

    df = pd.read_csv(file.filename, encoding='ISO-8859-1')


    df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
    df['Sales'] = df['Quantity'] * df['UnitPrice']
    df = df.groupby(pd.Grouper(key='InvoiceDate', freq=periodicity)).agg({'Sales': 'sum'}).reset_index()

    df['InvoiceDate'].fillna(-1, inplace=True)
    train_data = df.iloc[:-periods, :]
    test_data = df.iloc[-periods:, :]
    train_data['day_of_week'] = train_data['InvoiceDate'].dt.dayofweek
    train_data['day_of_year'] = train_data['InvoiceDate'].dt.day_of_year
    train_data['month'] = train_data['InvoiceDate'].dt.month
    train_data['quarter'] = train_data['InvoiceDate'].dt.quarter
    # print("trainset")
    print(train_data)
    model = RandomForestRegressor(random_state=42)

    param_grid = {
        'n_estimators': [10, 50, 100],
        'max_depth': [None, 10, 20],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }

    tscv = TimeSeriesSplit(n_splits=5)
    print(train_data)
    grid_search = GridSearchCV(model, param_grid, cv=tscv, scoring='neg_mean_squared_error')
    grid_search.fit(train_data[['day_of_week', 'day_of_year', 'month', 'quarter']], train_data['Sales'])

    test_data['day_of_week'] = test_data['InvoiceDate'].dt.dayofweek
    test_data['day_of_year'] = test_data['InvoiceDate'].dt.day_of_year
    test_data['month'] = test_data['InvoiceDate'].dt.month
    test_data['quarter'] = test_data['InvoiceDate'].dt.quarter

    y_pred = grid_search.predict(test_data[['day_of_week', 'day_of_year', 'month', 'quarter']])

    r2 = r2_score(test_data['Sales'], y_pred)

    pred_sales = pd.DataFrame({'Sales': y_pred})
    pred_sales.index = pd.date_range(start=train_data['InvoiceDate'].max() + pd.Timedelta(days=1), periods=periods, freq=periodicity)

    output = pred_sales.to_csv(header=True)

    # with open(r"D:\1 NotePad\DIGIVERZZ\dig.csv",'w') as f:
    #     f.write(output)
    
    return Response(
        f'R2 Score: {r2}\n' + output,
        mimetype="text/csv",
        headers={"Content-disposition":
                 "attachment; filename=predicted_sales.csv"})


@app.route('/', methods=['GET'])
def up():
    return "Sales Forecasting Prediction"

if __name__ == '__main__':
    app.run(debug=False)