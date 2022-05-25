import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { user } from '../Model/User.component';
import { NgForm } from '@angular/forms';
import { LoginResponse, PatientAndPatientInformation, User } from '../Shared/Models';
import { PatientModes } from '../Shared/Enums';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  @ViewChild("createappointment")
  form: NgForm;
  formSubmitted:boolean=false;
  user: user = new user();
  loggedInUser : User;
  public modes = { addMode:false, editMode:false, deleteMode:false};
  patientAndPatientInformation: PatientAndPatientInformation;
  constructor(
    private router: Router,
    private userService: UserService,
    private activatedRoute : ActivatedRoute
    ) { 
      this.loggedInUser = new User();
    }

  ngOnInit() {
    this.patientAndPatientInformation = new PatientAndPatientInformation();
    this.getActiveParams();
    this.checkLoggedInUser();
  }

  checkLoggedInUser(){
    let user : LoginResponse =JSON.parse(localStorage.getItem("user"));
    if(user && user?.userType=='receptionist'){
      console.log("user",user);
      this.loggedInUser.email = user?.email;
      this.loggedInUser.usertype = user?.userType;
      this.loggedInUser.username = user?.userName;
    }
    else {
      if(user?.userType) this.router.navigate([`${user?.userType}`]);
      else this.router.navigate(['login']);
    }
  }

  save(){
    this.formSubmitted=true;
    console.log("patient",this.patientAndPatientInformation)
    if(this.form.valid){
      alert("valid");
    }
    else {
      alert("invalid");
    }
  }

  getActiveParams(){
    this.activatedRoute.data.subscribe(x=>{
      if(x){
        console.log("data",x);
        console.log(this.activatedRoute.url.subscribe(x=>{console.log(x)}));
          this.setModes(x);
      }
    })
 //   this.getRequestIdFromUrl();
  }
  setModes(x?:any){
    switch(x.mode){
      case PatientModes.CREATE :this.addMode();break;
      case PatientModes.UPDATE:this.editMode();break;
      case PatientModes.DELETE:this.deleteMode();break;
    }
  }
  addMode(){
    this.modes.addMode=true;
  }
  editMode(){
    this.modes.editMode=true;
  }
  deleteMode(){
    this.modes.deleteMode=true;
  }
  
  updateUser(roleId) {
    console.log(this.user);
    if (roleId == 2) {
      this.user.fkRoleId = roleId;
      let observable = this.userService.createPatient(this.user);
      observable.subscribe((response) => {
        console.log(response);
      })
    }
    this.router.navigate(['']);
  }


}
