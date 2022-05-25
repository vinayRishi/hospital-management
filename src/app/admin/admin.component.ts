import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { VirtualTimeScheduler } from 'rxjs';
import { AppServiceService } from '../app-service.service';
import { Doctor, Laboratory, LoginResponse, Tests, User } from '../Shared/Models';
import { AdminServiceService } from './admin-service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isChildActive : boolean =false;
  public isChildComponent = "home";
  doctor:Doctor;
  test : Tests;
  staffUser : User;
  lab : Laboratory;
  @ViewChild('adddoctorfrom')
  doctorForm: NgForm
  @ViewChild('labfrom')
  labForm: NgForm
  @ViewChild('staffregisterfrom')
  staffregisterfrom:NgForm
  @ViewChild('testregisterForm')
  testregisterForm:NgForm
  loggedInUser : User;
  doctorFormSubmitted:boolean =false;
  labFormSubmitted:boolean=false;
  staffFormSubmitted:boolean=false;
  testFormSUbmitted:boolean=false;
  staticValueLabs : Laboratory[];
  registrationModalBool  = { 
    isDOctorRegistered:false,
    isTestsRegistered:false,
    isLabRegistered:false,
    isStaffRegister:false                       
  }

  constructor(
    private adminService : AdminServiceService,
    private appService : AppServiceService,
    private router: Router
  ) {
    this.doctor = new Doctor();
    this.test = new Tests();
    this.lab = new Laboratory();
    this.loggedInUser = new User();
    this.staffUser = new User();
    this.staticValueLabs = new Array<Laboratory>();
   }

  ngOnInit() {
    this.checkLoggedInUser();
    this.pullDataValuesList();
  }
  pullDataValuesList(){
      this.getStaticValueList();
  }
  getStaticValueList(){
    this.adminService.getAllLabaratories().subscribe(x=>{
      if(x){
        console.log("labs",x);
        this.staticValueLabs=x?.laboratoryList;
        console.log("staticValueLabs",this.staticValueLabs);
      }
    })
  }
  checkLoggedInUser(){
    let user : LoginResponse =JSON.parse(localStorage.getItem("user"));
    if(user){
      console.log("user",user);
      this.loggedInUser.email = user?.email;
      this.loggedInUser.usertype = user?.userType;
      this.loggedInUser.username = user?.userName;
      this.appService.userLoggedIndata(user);
      this.goToHome();
    }
    else {
      this.router.navigate(['login']);
    }
  }
  saveDoctor(){
    this.doctorFormSubmitted=true;
    if(this.doctorForm.valid){
      localStorage.setItem(`${this.loggedInUser.email}_saveDoctor`,JSON.stringify(this.doctor));
    }
  }
  submitDoctorDetails(){
    this.doctorFormSubmitted=true;
    if(this.doctorForm.valid){
      this.adminService.registerDoctor(this.doctor).subscribe(x=>{
        if(x){
          this.registrationModalBool.isDOctorRegistered=true;
          this.doctor= new Doctor();
          this.doctorFormSubmitted=false;
          localStorage.removeItem(`${this.loggedInUser.email}_saveDoctor`);
        }
      })
    }
  }

  saveLaboratory(){
    this.labFormSubmitted=true;
    if(this.labForm.valid){
      console.log("Lab",this.lab);
      localStorage.setItem(`${this.loggedInUser.email}_saveLab`,JSON.stringify(this.lab));
    }
  }

  submitLabDetails(){
    this.labFormSubmitted=true;
    if(this.labForm.valid){
      this.adminService.registerLaboratory(this.lab).subscribe(x=>{
        if(x){
          this.registrationModalBool.isLabRegistered=true;
          this.lab= new Laboratory();
          this.labFormSubmitted=false;
          localStorage.removeItem(`${this.loggedInUser.email}_saveLab`);
          this.pullDataValuesList();
        }
      })
    }
  }

  saveStaff(){
    this.staffFormSubmitted=true;
    if(this.staffregisterfrom.valid){
      localStorage.setItem(`${this.loggedInUser.email}_saveStaff`,JSON.stringify(this.staffUser));
    }
  }

  submitStaff(){
    this.staffFormSubmitted=true;
    this.staffUser.password="Default123";
    if(this.staffregisterfrom.valid){
      this.adminService.registerStaff(this.staffUser).subscribe(x=>{
        if(x){
          this.registrationModalBool.isStaffRegister=true;
          this.staffUser= new User();
          this.staffFormSubmitted=false;
          localStorage.removeItem(`${this.loggedInUser.email}_saveStaff`);
          this.pullDataValuesList();
        }
      })
    }
  }

  saveTests(){
    this.testFormSUbmitted=true;
    if(this.testregisterForm.valid){
      localStorage.setItem(`${this.loggedInUser.email}_saveTest`,JSON.stringify(this.test));
    }
  }

  submitTests(){
    this.testFormSUbmitted=true;
    if(this.testregisterForm.valid){
      this.adminService.registerTests(this.test).subscribe(x=>{
        if(x){
          this.registrationModalBool.isTestsRegistered=true;
          this.test= new Tests();
          this.testFormSUbmitted=false;
          localStorage.removeItem(`${this.loggedInUser.email}_saveTest`);
        }
      })
    }
  }
  register(){
    console.log("home");
    this.isChildActive=true;
  }
  registerDoctor(){
    this.isChildActive=true;
    this.isChildComponent="doctor";
    let saveDoctor = JSON.parse(localStorage.getItem(`${this.loggedInUser.email}_saveDoctor`));
    if(saveDoctor){
      this.doctor = saveDoctor;
    }
  }
  registerLab(){
    this.isChildActive=true;
    this.isChildComponent="lab";
    let saveLab = JSON.parse(localStorage.getItem(`${this.loggedInUser.email}_saveLab`));
    if(saveLab){
      this.lab = saveLab;
    }
  }
  registerStaffLogin(){
    this.isChildActive=true;
    this.isChildComponent="staff";
    let saveStaff : User =JSON.parse(localStorage.getItem(`${this.loggedInUser.email}_saveStaff`));
    if(saveStaff){
      this.staffUser=saveStaff;
    }
  }
  registerTests(){
    this.isChildActive=true;
    this.isChildComponent="tests";
    let test =JSON.parse(localStorage.getItem(`${this.loggedInUser.email}_saveTest`));
    if(test){
      console.log("test",test);
      this.test=test;
      this.test.lab=test?.lab;
    }
  }
  goToHome(){
    this.isChildActive=false;
    this.isChildComponent="home";
  }
}
