import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse, LoginModel, Doctor, Laboratory, User, Tests, PatientAndPatientInformation, PatientSearchFilter } from '../Shared/Models';

@Injectable({
  providedIn: 'root'
})
export class ReceptionistServiceService {
  public url:string ="http://localhost:8088/api/receptionist";
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

  loginWithCredentials(login : LoginModel) {
    const url=`${this.url}/login`;
    return this.http.post(url,login,{headers:this.headers}) as Observable<any>;
  }
  registerDoctor(doctor:Doctor){
    const url =`${this.url}/addDoctor`;
    return this.http.post(url,doctor,{headers:this.headers}) as Observable<any>;
  }

  registerLaboratory(lab :Laboratory){
    const url =`${this.url}/addLaboratory`;
    return this.http.post(url,lab,{headers:this.headers}) as Observable<any>;
  }
  registerStaff(staff:User){
    const url =`${this.url}/registerStaffRole`;
    return this.http.post(url,staff,{headers:this.headers}) as Observable<any>;
  }
  getAllLabaratories(){
    const url =`${this.url}/getAllLabaratories`;
    return this.http.get(url,{headers:this.headers}) as Observable<any>;
  }
  registerTests(tests:Tests){
    const url =`${this.url}/addTests`;
    return this.http.post(url,tests,{headers:this.headers}) as Observable<any>;
  }
  getAllDoctors(){
    const url =`${this.url}/getDoctors`;
    return this.http.get(url,{headers:this.headers}) as Observable<any>;
  }
  createAppointment(patient:PatientAndPatientInformation){
    const url =`${this.url}/addPatient`;
    return this.http.post(url,patient,{headers:this.headers}) as Observable<any>;
  }
  searchPatientByPatientDetails(patientFilter:PatientSearchFilter){
    const url =`${this.url}/getPatientDetails`;
    return this.http.post(url,patientFilter,{headers:this.headers}) as Observable<any>;
  }
  submitModifiedPatientDetails(patientAndPatientInformation:PatientAndPatientInformation){
    console.log("patient",patientAndPatientInformation);
    const url =`${this.url}/updatePatient`;
    return this.http.put(url,patientAndPatientInformation,{headers:this.headers}) as Observable<any>;
  }
  submitDeletePatientDetails(patientAndPatientInformation:PatientSearchFilter){
    const url =`${this.url}/deletePatient`;
    return this.http.post(url,patientAndPatientInformation,{headers:this.headers}) as Observable<any>;
  }
  
}
