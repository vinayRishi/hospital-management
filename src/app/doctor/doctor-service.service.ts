import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse, PatientPrescription, PatientTests } from '../Shared/Models';

@Injectable({
  providedIn: 'root'
})
export class DoctorServiceService {
  public url:string ="http://localhost:8088/api/doctor";
  public urlAttachments:string = "http://localhost:8088/api/attachments";
  headers: any;
  token : any;

  constructor(private http: HttpClient) {
    this.retriveToken();
    this.setheaders();
   }

   retriveToken(){
    let user : LoginResponse =JSON.parse(localStorage.getItem("user"));
     if(user){
      this.token = user.auth_TOKEN;
      this.setheaders();
     }
   }

   setheaders(){
    this.headers={
     Accept: "*/*",
     AUTH_TOKEN: `${this.token}`
   }
  }

  getPatientsByDoctorEmail(email:any){
    const url=`${this.url}/${email}/patients`;
    return this.http.get(url,{headers:this.headers}) as Observable<any>;
  }
  saveDoctorPerscription(doctorId:any, patientPrescription:PatientPrescription){
    const url=`${this.url}/${doctorId}/prescription`;
    return this.http.post(url,patientPrescription,{headers:this.headers}) as Observable<any>;
  }
  saveTestsAndScansForPatient(doctorId:any,patientTestsInfo?:PatientTests){
    const url=`${this.url}/${doctorId}/tests`;
    return this.http.post(url,patientTestsInfo,{headers:this.headers}) as Observable<any>;
  }
  getPatientDetailsWaitingForScan(id: any){
    const url=`${this.url}/${id}/scans`;
    return this.http.get(url,{headers:this.headers}) as Observable<any>;
  }
  getLabsAndTests(){
    const url=`${this.url}/labsAndTests`;
    return this.http.get(url,{headers:this.headers}) as Observable<any>;
  }
  saveAttachments(files:any){
    const url=`${this.urlAttachments}/uploadFile`;
    return this.http.post(url,files,{headers:this.headers}) as Observable<any>;
  }
  deleteSelectedTestsForPatient(email:any,patientInfoId:any,testId?:any){
    const url=`${this.url}/${email}/tests/${patientInfoId}/${testId}`;
    return this.http.delete(url,{headers:this.headers}) as Observable<any>;
  }
}
