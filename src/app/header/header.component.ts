import { Component, OnInit } from '@angular/core';
import { AppServiceService } from '../app-service.service';
import { LoginService } from '../login/login.service';
import { User } from '../Shared/Models';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username : String;
  loggedInuser :User;
  constructor(
    private loginService : LoginService,
    private appService:AppServiceService) {
    this.loggedInuser = new User();
   }

  ngOnInit( ) {
    this.subscribeSubjects();
  }

  subscribeSubjects(){
    this.appService.userLoggedIn$?.subscribe(x=>{
      if(x){
        this.loggedInuser.email =x?.email;
        this.loggedInuser.username=x?.userName;
        this.loggedInuser.usertype=x?.usertype;
        if(this.loggedInuser.usertype=='' || this.loggedInuser.usertype==null){
          
        }
      }
    })
  }

  logout(){
    localStorage.removeItem("user");
    console.log("came here");
    window.location.reload();
  }
}
