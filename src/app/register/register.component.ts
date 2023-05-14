import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

formdata={name:"", email:"", pass:""};
submit=false;
errorMessage="";
Loading=false;

constructor(private auth:AuthService){

}
ngOnInit(): void {
    this.auth.canAuthenticate();
}

  onSubmit(){
      
      this.Loading=true;

      this.auth.register(this.formdata.name,this.formdata.email,this.formdata.pass).subscribe({
        next:data=>{
          this.auth.storeToken(data.idToken);
          console.log("Registered Idtoken is "+ data.idToken);
          this.auth.canAuthenticate();
          
        },
        error:data=>{
          if(data.error.error.message=="INVALID_EMAIL"){
                  this.errorMessage="Invalid Email!";
          }
          else if(data.error.error.message=="EMAIL_EXISTS"){
                  this.errorMessage="Already email Exists";
          }
          else{
            this.errorMessage="unkown error occured when creating this account!";
          }

          }
        }).add(()=>{
          this.Loading=false;
          console.log("register completed")
        });
  }
}