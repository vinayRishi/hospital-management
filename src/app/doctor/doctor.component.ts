import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { Doctor, Laboratory, LoginResponse, PatientAndPatientInformation, PatientPrescription, PatientTests, Tests, User } from '../Shared/Models';
import { UserService } from '../user.service';
import { DoctorServiceService } from './doctor-service.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  user: any;
  isLoaded: boolean = false;
  loggedInUser : User;
  doctor :Doctor;
  selectedPatientForPrescription:PatientPrescription;
  selectedPatientTests:PatientTests;
  patientTestToFill:Tests;
  @ViewChild('prescriptionForm')
  doctorForm: NgForm
  @ViewChild('scanForm')
  scanForm: NgForm
  @ViewChild('testsForm')
  testsForm: NgForm
  formSubmitted : boolean
  scanFormSubmitted:boolean;
  testFormSubmitted:boolean;
  patientList : PatientAndPatientInformation[]=[];
  tests:Tests[]=[];
  constructor(
    private userService: UserService,
    private doctorService: DoctorServiceService,
    private appService : AppServiceService,
    private router: Router
    ) {
    this.loggedInUser = new User();
    this.doctor = new Doctor();
    this.patientList = new Array<PatientAndPatientInformation>();
    this.selectedPatientForPrescription = new PatientPrescription();
    this.selectedPatientTests = new PatientTests();
    this.patientTestToFill = new Tests();
    this.tests = new Array<Tests>();
  }

  ngOnInit() {
    this.checkLoggedInUser();
  }


  checkLoggedInUser(){
    let user : LoginResponse =JSON.parse(localStorage.getItem("user"));
    if(user){
      console.log("user",user);
      this.loggedInUser.email = user?.email;
      this.loggedInUser.usertype = user?.userType;
      this.loggedInUser.username = user?.userName;
      this.appService.userLoggedIndata(user);
      this.getpatientDetailsByDoctorId();
      this.getLabsAndTests();
    }
    else {
      this.router.navigate(['login']);
    }
  }

  getLabsAndTests(){
    this.doctorService.getLabsAndTests().subscribe(x=>{
      if(x && x?.status=='200'){
        this.tests=x?.testList;
        console.log("labs and tests",this.tests);
      }
    })
  }
  getpatientDetailsByDoctorId(){
    this.doctorService.getPatientsByDoctorEmail(this.loggedInUser?.email).subscribe(x=>{
      if(x && x?.status=='200'){
        this.patientList=x?.patientList;
        console.log("this.patientList",this.patientList);
      }
    })
  }

  savePrescription(){
    this.formSubmitted=true;
    if(this.doctorForm.valid){
      this.doctorService.saveDoctorPerscription(this.loggedInUser?.email,
        this.selectedPatientForPrescription).subscribe(x=>{
          if(x && x?.status=='200'){
            console.log('result',x);
            this.patientList.filter(y=>y.patient.patientId==this.selectedPatientForPrescription?.patientId)[0]
            .patientInformation.doctorPrescription=this.selectedPatientForPrescription?.prescription;
            this.formSubmitted=false;
           // this.selectedPatientForPrescription = new PatientPrescription();
            document.getElementById('modal-dismissal').click();
          }
        })
    }
    else {
      alert("invalid prescription details");
    }
  }
  seletedPatient(patient:PatientAndPatientInformation){
    console.log("patient",patient);
    this.selectedPatientForPrescription.patientId=patient?.patient?.patientId;
    this.selectedPatientForPrescription.prescription = patient?.patientInformation?.doctorPrescription;
  }
  selectedPatientsForTests(patient:PatientAndPatientInformation){
    this.selectedPatientTests.tests=patient?.patientInformation?.tests;
    this.selectedPatientTests.patientId=patient?.patient?.patientId;
    this.patientTestToFill= new Tests();
  }
  deleteSelectedPatientsForTests(test:Tests,patients?:PatientAndPatientInformation,index?:any){
    console.log("tests",this.tests);
    this.patientTestToFill=test;
    console.log("this.patientTestToFill",this.patientTestToFill);
    this.doctorService.deleteSelectedTestsForPatient(this.loggedInUser?.email,
      patients?.patientInformation?.id, test?.testId)
    .subscribe(x=>{
      if(x && x?.status=='200'){
        let i = patients?.patientInformation?.tests?.indexOf(test);
        patients?.patientInformation.tests?.splice(i,1);
        this.patientList[index]=patients;
      }
    });
  }
  valueSelected(v:any){
    console.log("selected value",v);
  }

  saveTests(){
    this.testFormSubmitted=true;
    if(this.testsForm.valid && this.patientTestToFill?.testName){
      this.selectedPatientTests.tests.push(this.patientTestToFill);
      console.log("this.selectedPatientTests.tests",this.selectedPatientTests.tests);
      this.doctorService.saveTestsAndScansForPatient(this.loggedInUser?.email,
        this.selectedPatientTests).subscribe(x=>{
          if(x && x?.status=='200'){
            let pateintInfo= this.patientList.filter(y=>y.patient.patientId==this.selectedPatientTests?.patientId)[0];
            pateintInfo.patientInformation.tests=[];
            this.selectedPatientTests.tests.forEach(element=>{
              pateintInfo.patientInformation.tests.push(element);
            })
            this.patientList.filter(y=>y.patient.patientId==this.selectedPatientTests?.patientId)[0]
            .patientInformation.tests=pateintInfo?.patientInformation?.tests;
             this.testFormSubmitted=false;
            document.getElementById('modal-dismissal2').click();
          }
          else {
            if(x?.message.toLowerCase().includes("multiple"))
            alert(`Failed - : The entered test ${this.patientTestToFill?.testName} is already assigned to patient`);
            document.getElementById('modal-dismissal2').click();
          }
        })
    }
    else {
      alert("please select test details");
    }
  }
  downloadFile(file:any){
    console.log("file",file);
      let blob = new Blob([file.data],{'type': "application/octet-stream"});
            saveAs(blob,file.name);
      }
}
