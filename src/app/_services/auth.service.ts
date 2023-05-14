import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router,private http:HttpClient) { }

isAuthenticated():boolean{
if(sessionStorage.getItem('token')!==null){
  return true;
}

  return false;
  }

  canAcces(){
    if(!this.isAuthenticated()){
      this.router.navigate(['/login']);
    }
  }
  canAuthenticate(){
    if(this.isAuthenticated()){
      this.router.navigate(['/dashboard']);
  }
  }   

register(name:string,email:string,pass:string){
  
return this.http.post<{idToken:string}>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDdkGuJ99Uhz8l_IbKE_78VNh5E7BiHfSY',
{displayName:name,email:email,password:pass});

}
storeToken(token:string){
    sessionStorage.setItem('token',token);
}

login(email:string,pass:string){
    return this.http.post<{idToken:string}>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDdkGuJ99Uhz8l_IbKE_78VNh5E7BiHfSY',
    {email:email,password:pass}

    );
}

removeToken(){
  sessionStorage.removeItem('token');
}

} 