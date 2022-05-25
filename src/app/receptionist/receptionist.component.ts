import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { PatientModes } from '../Shared/Enums';
import { User, LoginResponse, PatientAndPatientInformation, Doctor, PatientSearchFilter } from '../Shared/Models';
import { UserService } from '../user.service';
import { ReceptionistServiceService } from './receptionist-service.service';

@Component({
  selector: 'app-receptionist',
  templateUrl: './receptionist.component.html',
  styleUrls: ['./receptionist.component.css']
})
export class ReceptionistComponent implements OnInit {
  public loggedInUser:User;
  
  @ViewChild("createappointment")
  form: NgForm;
  formSubmitted:boolean=false;
  retrievedSavedData :boolean =false;
  user: User;
  isChildActive : boolean =false;
  public doctorList : Doctor[]=[];
  public isChildComponent = "home";
  public selectedDoctor :Doctor;
  public patientSearchFilter : PatientSearchFilter;
  public modes = { addMode:false, editMode:false, deleteMode:false};
  patientAndPatientInformation: PatientAndPatientInformation;
  isPatientRegisteredOrModified :boolean =false;
  constructor(
    private router: Router,
    private userService: UserService,
    private activatedRoute : ActivatedRoute,
    private appService:AppServiceService,
    private receptionistService : ReceptionistServiceService
    ) { 
      this.loggedInUser = new User();
      this.doctorList = new Array<Doctor>();
      this.patientAndPatientInformation = new PatientAndPatientInformation();
      this.patientSearchFilter = new PatientSearchFilter();
    }


  ngOnInit() {
    this.checkLoggedInUser();
    this.getStaticValueList();
  }

  getStaticValueList(){
    this.receptionistService.getAllDoctors().subscribe(x=>{
      if(x && x?.status=='200'){
        this.doctorList=x?.doctorlist;
        console.log('x',x);
      }
      else if(x && x?.status=='500'){
        console.log('x',x);
      //  localStorage.removeItem("user");
       // this.router.navigate(['login']);
      }
    })
  }

  checkLoggedInUser(){
    let user : LoginResponse =JSON.parse(localStorage.getItem("user"));
    if(user && user?.userType=='receptionist'){
      console.log("user",user);
      this.loggedInUser.email = user?.email;
      this.loggedInUser.usertype = user?.userType;
      this.loggedInUser.username = user?.userName;
      this.appService.userLoggedIndata(user);
    }
    else {
      if(user?.userType)
      this.router.navigate([`${user?.userType}`]);
      else this.router.navigate(['login']);
    }
  }

  submitPatientDetails(){
    this.formSubmitted=true;
    if(this.form.valid){
      let doctorId= this.patientAndPatientInformation.patientInformation.doctor?.doctorId;
      this.patientAndPatientInformation.patientInformation.doctor = this.doctorList.filter(x=>x.doctorId==doctorId)[0];
      console.log("this.patient",this.patientAndPatientInformation);
      console.log("JSON.stringify",JSON.stringify(( this.patientAndPatientInformation)));
      this.receptionistService.createAppointment(this.patientAndPatientInformation).subscribe(x=>{
        if(x && x?.status=="200"){
          this.formSubmitted=false;
          console.log("patieint submitted",x);
          this.isPatientRegisteredOrModified=true;
          this.patientAndPatientInformation = new PatientAndPatientInformation();
          this.selectedDoctor = new Doctor();
          localStorage.removeItem(`${this.loggedInUser.email}_patientAddMode`);
        }
      },err=>{
        console.log("error");
      })
    }
  }

  submitDeletePatientRequest(){
    this.formSubmitted=true;
    if(this.form.valid){
      this.patientSearchFilter.email =this.patientAndPatientInformation.patientInformation.email;
      this.patientSearchFilter.patientId= this.patientAndPatientInformation.patient.patientId;
      this.receptionistService.submitDeletePatientDetails(this.patientSearchFilter).subscribe(x=>{
        console.log("delete",x);
        if(x && x?.status=='200'){
          this.formSubmitted=false;
          this.isPatientRegisteredOrModified=true;
          this.patientAndPatientInformation = new PatientAndPatientInformation();
          this.selectedDoctor = new Doctor();
          localStorage.removeItem(`${this.loggedInUser.email}_patientDeleteMode`);
        }
      })
    }
  }
  submitModifyPatientDetails(){
    this.formSubmitted=true;
    if(this.form.valid){
      this.receptionistService.submitModifiedPatientDetails(this.patientAndPatientInformation).subscribe(x=>{
        if(x && x?.status=='200'){
          this.formSubmitted=false;
          this.isPatientRegisteredOrModified=true;
          this.patientAndPatientInformation = new PatientAndPatientInformation();
          this.selectedDoctor = new Doctor();
          localStorage.removeItem(`${this.loggedInUser.email}_patientEditMode`);
          this.retrievedSavedData=false;
        }
      })
    }
  }
  savePatient(){
    this.formSubmitted=true;
    if(this.form.valid){
      if(this.modes?.addMode){
        localStorage.setItem(`${this.loggedInUser.email}_patientAddMode`,JSON.stringify(this.patientAndPatientInformation));
      }
      else if(this.modes?.editMode){
        localStorage.setItem(`${this.loggedInUser.email}_patientEditMode`,JSON.stringify(this.patientAndPatientInformation));
      }
      else if(this.modes?.deleteMode){
        localStorage.setItem(`${this.loggedInUser.email}_patientDeleteMode`,JSON.stringify(this.patientAndPatientInformation));
      }
      this.retrievedSavedData=false;
    }
  }

  searchPatient(){
    if(this.patientSearchFilter?.email?.length>0 || this.patientSearchFilter?.mobileNumber?.length){
      console.log("this.patientFIlter",this.patientSearchFilter);
      this.patientSearchFilter.mobileNumber =`+91${this.patientSearchFilter?.mobileNumber}`;
      this.receptionistService.searchPatientByPatientDetails(this.patientSearchFilter).subscribe(x=>{
        if(x && x?.status=='200'){
          this.patientAndPatientInformation =x?.patientInfoBody[0];
          this.patientSearchFilter = new PatientSearchFilter();
          document.getElementById('modal-dismissal').click();
          document.getElementById('searchField').innerText = 
          `${this.patientAndPatientInformation.patient.firstName} 
          ${this.patientAndPatientInformation.patient.lastName}`;
          this.retrievedSavedData=false;
          this.setSelectedDoctor(this.patientAndPatientInformation.patientInformation.doctor.doctorId);
        }
      },err=>{
        console.log("error");
      })
    }
  }
  setModes(mode?:any){
    switch(mode){
      case PatientModes.CREATE :this.addMode();break;
      case PatientModes.UPDATE:this.editMode();break;
      case PatientModes.DELETE:this.deleteMode();break;
      case 'home' : this.isChildComponent='home'; this.isChildActive=false;
      this.isPatientRegisteredOrModified=false;  break;
    }
  }
  addMode(){
    this.modes.addMode=true;
    this.modes.editMode=false;
    this.modes.deleteMode=false;
    this.formSubmitted=false;
    this.isChildActive=true;
    this.retrievedSavedData=false;
    this.isChildComponent='create';
    this.patientAndPatientInformation = new PatientAndPatientInformation();
    this.isPatientRegisteredOrModified=false;
    let patient = JSON.parse(localStorage.getItem(`${this.loggedInUser.email}_patientAddMode`));
    if(patient){
      this.retrievedSavedData=true;
      this.patientAndPatientInformation = patient;
      this.setSelectedDoctor(this.patientAndPatientInformation.patientInformation.doctor.doctorId);
    }
  }
  editMode(){
    this.modes.editMode=true;
    this.formSubmitted=false;
    this.modes.addMode=false;
    this.modes.deleteMode=false;
    this.isChildActive=true;
    this.retrievedSavedData=false;
    this.isChildComponent='modify';
    this.isPatientRegisteredOrModified=false;
    this.patientAndPatientInformation = new PatientAndPatientInformation();
    let patient = JSON.parse(localStorage.getItem(`${this.loggedInUser.email}_patientEditMode`));
    if(patient){
      this.patientAndPatientInformation = patient;
      this.retrievedSavedData=true;
      this.setSelectedDoctor(this.patientAndPatientInformation.patientInformation.doctor.doctorId);
    }
  }
  deleteMode(){
    this.modes.deleteMode=true;
    this.modes.addMode=false;
    this.modes.editMode=false;
    this.formSubmitted=false;
    this.isChildActive=true;
    this.isChildComponent='delete';
    this.isPatientRegisteredOrModified=false;
    this.retrievedSavedData=false;
    this.patientAndPatientInformation = new PatientAndPatientInformation();
    let patient = JSON.parse(localStorage.getItem(`${this.loggedInUser.email}_patientDeleteMode`));
    if(patient){
      this.retrievedSavedData=true;
      this.patientAndPatientInformation = patient;
    }
  }
  setSelectedDoctor(event?:any){
    console.log("event",event);
    this.selectedDoctor = new Doctor();
    this.selectedDoctor = this.doctorList.filter(x=>x.doctorId==event)[0];

  }
  addPatient(){
    this.router.navigate(['patient/create'])
  }
}
