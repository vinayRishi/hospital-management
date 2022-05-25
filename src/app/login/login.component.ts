import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { LoginModel, LoginResponse } from '../Shared/Models';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = { 'username': 'aravindlakshmanan007@gmail.com', 'password': '1234' }

  showSuccess: boolean = false;
  showError: boolean = false;
  isAuthenticated: boolean = false;
  loginData : LoginModel ={};
  formSubmitted: boolean;
  errorMessage: any;

  constructor(private loginService: LoginService, private router: Router, private appService:AppServiceService) { }

  ngOnInit() {
    this.checkIsLoggedin();
  }
  checkIsLoggedin(){
    let loggedInuser = JSON.parse(localStorage.getItem("user"));
    if(loggedInuser){
      console.log("loggeduser",loggedInuser);
      this.router.navigate([`${loggedInuser.userType}`]);
    }
  }
  authenticate() {
    this.formSubmitted=true;
      if(this.loginData.email && this.loginData.password) {
        this.loginService.loginWithCredentials(this.loginData).subscribe((x:LoginResponse)=>{
          if(x && x.status=='200'){
            this.showError = false;
            this.formSubmitted=false;
            this.showSuccess = true;
            console.log("result",x);
            localStorage.setItem("user",JSON.stringify(x));
            this.appService.userLoggedIndata(x);
            this.router.navigate([`${x.userType}`]);
            alert("loggedin successfully");
          }
          else{
            this.showError = true;
            this.showSuccess = false;
            console.log(this.showSuccess);
          }
        },err=>{
            this.showError = true;
            this.showSuccess = false;
            this.errorMessage='Internal Server Error';
            console.log(err)
            console.log(this.showSuccess);
        })
      }
  }

  signup() {
    this.router.navigate(["signup"]);
  }

}
