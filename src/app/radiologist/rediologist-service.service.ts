import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse, TestPostRequest } from '../Shared/Models';

@Injectable({
  providedIn: 'root'
})
export class RediologistServiceService {

  public url:string ="http://localhost:8088/api/radiologist";
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

   getRadiologistIdDetails(){
    const url=`${this.url}/getRadiologyId`;
    return this.http.get(url,{headers:this.headers}) as Observable<any>;
  }

  getPatientDetailsWaitingForScan(id: any){
    const url=`${this.url}/${id}/scans`;
    return this.http.get(url,{headers:this.headers}) as Observable<any>;
  }
  saveAttachments(files:any){
    const url=`${this.urlAttachments}/uploadFile`;
    return this.http.post(url,files,{headers:this.headers}) as Observable<any>;
  }
  deleteAttachment(files:any){
    const url=`${this.urlAttachments}/files/${files?.id}`;
    return this.http.delete(url,{headers:this.headers}) as Observable<any>;
  }
  downLoadAttachemnt(file:any){
    const url=`${this.urlAttachments}/files/${file?.id}`;
    //this.headers.responseType='arraybuffer';
    return this.http.get(url,{responseType:"arraybuffer"}) as Observable<any>;
  }
  saveTestScanResultForPatient(id:any,testpatient:TestPostRequest){
    const url=`${this.url}/${id}/scans`;
    return this.http.post(url,testpatient,{headers:this.headers}) as Observable<any>;
  }

  getPatientInformationByPatientDetails(patientId?:any){
    const url=`${this.url}/${patientId}/getPatientsInformation`;
    return this.http.get(url,{headers:this.headers}) as Observable<any>;
  }
}

