import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { RediologistServiceService } from '../radiologist/rediologist-service.service';
import { ReceptionistServiceService } from '../receptionist/receptionist-service.service';
import { PatientModes } from '../Shared/Enums';
import { saveAs } from 'file-saver';
import { User, Doctor, PatientSearchFilter, PatientAndPatientInformation, LoginResponse, FileDB, GetPatientTestListAndPatientInfo, GetTestPatientList, TestPostRequest, sortById } from '../Shared/Models';
import { UserService } from '../user.service';
import { PathologistServiceService } from './pathologist-service.service';

@Component({
  selector: 'app-pathologist',
  templateUrl: './pathologist.component.html',
  styleUrls: ['./pathologist.component.css']
})
export class PathologistComponent implements OnInit {
  
  public labId : string;
  public patientListToScan : GetTestPatientList[]=[];
  public patientListToScanAndPatientInfo : GetPatientTestListAndPatientInfo[]=[];
  public testPostRequest :TestPostRequest;
  public uploadBill :FileDB;
  public uploadReport : FileDB;
  files: any[] = [];
  file: any; 
  loggedInUser : User;
  isRequestProcessed: boolean;
  constructor(

    private pathologistService : PathologistServiceService,
    private appService : AppServiceService,
    private router: Router,
    private httpClient: HttpClient
  ) {
    this.patientListToScan = new Array<GetTestPatientList>();
    this.testPostRequest = new TestPostRequest();
    this.uploadBill = new FileDB();
    this.uploadReport= new FileDB();
    this.loggedInUser= new User();
    this.patientListToScanAndPatientInfo = new Array<GetPatientTestListAndPatientInfo>();
   }

  ngOnInit() {
    this.checkLoggedInUser();
    this.initComponent();
  }

  getPatientInformationByPatient(){
    this.patientListToScan.forEach(y=>{
      console.log("x",y);
      this.pathologistService.getPatientInformationByPatientDetails(y?.patientId).subscribe(x=>{
        let patientAndPatientInformation = new GetPatientTestListAndPatientInfo();
        patientAndPatientInformation.patientTestData=y;
        patientAndPatientInformation.patientInfo=x?.patientInfoList;
        this.patientListToScanAndPatientInfo.push(patientAndPatientInformation);
        console.log("this.patientListToScanAndPatientInfo",this.patientListToScanAndPatientInfo);
        this.isRequestProcessed=true;
      });
    })
  }
  initComponent(){
    this.pathologistService.getPathologyIdDetails().subscribe(x=>{
      if(x && x?.status=='200'){
        this.labId =x?.labId;
        this.getPatientScanData();
      }
    },err=>{
      console.log('err',err.error);
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
    }
    else {
      this.router.navigate(['login']);
    }
  }
  getPatientScanData(){
    this.pathologistService.getPatientDetailsWaitingForScan(this.labId).subscribe(x=>{
      if(x && x?.status=='200'){
        console.log("x",x);
        x?.testList.forEach(element => {
          this.patientListToScan.push(this.mapTestValuesTOEntity(element));
        });
        this.patientListToScan.sort(sortById);
        this.getPatientInformationByPatient();
      }
    })
  }

  mapTestValuesTOEntity(list?:any): GetTestPatientList{
    let Tlist :GetTestPatientList;
    Tlist = new GetTestPatientList();
    Tlist.patientId=list[0];
    Tlist.mobileNumber=list[1];
    Tlist.firstName=list[2];
    Tlist.lastName=list[3];
    Tlist.testId=list[4];
    Tlist.testName=list[5];
    return Tlist;
  }

  saveBillsForPatient(event:GetPatientTestListAndPatientInfo , type?:any){
    this.saveAttachemnts(event,type);
  }
  saveReportsForPatient(event:any , type?:any){
    this.saveAttachemnts(event,type);
  }
  onFilesSelected(event) {
    this.file = event.target.files[0];
  }

  saveAttachemnts(patient?:GetPatientTestListAndPatientInfo ,type?:any){
    if(this.file){
      let formData = new FormData();
      formData.append('file',this.file);
      this.pathologistService.saveAttachments(formData).subscribe(x=>{
        console.log("result",x);
        this.file ='';
      // patient?.
      this.testPostRequest.bills =patient?.patientInfo?.bills;
      if(patient?.patientInfo?.files.length>0){
        this.testPostRequest.scanReports = patient?.patientInfo?.files;
      }
      else{
        this.testPostRequest.scanReports=[];
      }
      if(type=='bills'){
        this.testPostRequest.bills.push(x?.file);
      }
      else if(type=='reports'){
        this.testPostRequest.scanReports.push(x?.file);
      }
        this.testPostRequest.patientId=patient?.patientTestData?.patientId;
        this.testPostRequest.patientMobileNo=patient?.patientTestData?.mobileNumber;
        this.testPostRequest.testId=patient?.patientTestData?.testId;
        this.testPostRequest.testName=patient?.patientTestData.testName;
        this.saveTestPostRequest();
      });
    }else{
      alert("please upload file");
    }
  }
  saveTestPostRequest(){
    if(this.testPostRequest){
      this.pathologistService.saveTestScanResultForPatient(this.labId,this.testPostRequest).subscribe(x=>{
        if(x && x?.status=='200'){
          console.log("saved test post request",x);
          window.location.reload();
        }
      })
    }
  }

  downloadFile(file:any){
    console.log("file",file);
      let blob = new Blob([file.data],{'type': "application/octet-stream"});
            saveAs(blob,file.name);
  }

  deleteFile(file:FileDB,patients?:GetPatientTestListAndPatientInfo, indexofPatient?:any){
    if(patients?.patientInfo?.id){
      this.pathologistService.deleteAttachment(file).subscribe(x=>{
        console.log("result",x);
        if(x){
          let patientInformation =this.patientListToScanAndPatientInfo[indexofPatient];
          let fileIndex = patientInformation?.patientInfo?.files.indexOf(file);
          patientInformation?.patientInfo?.files.splice(fileIndex,1);
          this.patientListToScanAndPatientInfo[indexofPatient]=patientInformation;
        }
      })
    }
  }
  deleteBillFile(file:FileDB,patients?:GetPatientTestListAndPatientInfo, indexofPatient?:any){
    if(patients?.patientInfo?.id){
      this.pathologistService.deleteAttachment(file).subscribe(x=>{
        console.log("result",x);
        if(x){
          let patientInformation =this.patientListToScanAndPatientInfo[indexofPatient];
          let fileIndex = patientInformation?.patientInfo?.bills.indexOf(file);
          patientInformation?.patientInfo?.bills.splice(fileIndex,1);
          this.patientListToScanAndPatientInfo[indexofPatient]=patientInformation;
        }
      })
    }
  }
  
}

