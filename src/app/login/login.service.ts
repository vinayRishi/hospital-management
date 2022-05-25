import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginModel } from '../Shared/Models';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public url:string ="http://localhost:8088/api/home";
  headers: any;
  constructor(private http: HttpClient) {

   }

   setheaders(){
     this.headers ={
      'Content-Type': "application/json",
      'Accept': "application/json"
     }
   }
  loginWithCredentials(login : LoginModel) {
    const url=`${this.url}/login`;
    return this.http.post(url,login,{headers:this.headers}) as Observable<any>;
  }

}
