import { ThrowStmt } from "@angular/compiler";
import { logging } from "selenium-webdriver";



export class User {
    userid? :number;
	email? :string;
	username? :string;
	password? :string;
	usertype? :string;
	age? :number;
}
export interface LoginModel {
    email? : string;
    password?: string;
}

export interface LoginResponse {
    auth_TOKEN?: string;
    email?: string;
    message?: string;
    status?: string;
    userName?: string;
    userType?: string;
}

export class Doctor {
    doctorId? :number;
    name? :string;
	age? :number;
	gender? :string;
	specilization? :string;
	costPerAppointment? :number;
	email? :string;
	phoneNumber? :string;
}

export class Patient{
    patientId? : any;
	firstName? :string;
    lastName? :string;
	disease? :string;
    mobileNumber? :string;
}

export class Laboratory  {
    labId? :string;
    labName? :string;
}

export class Tests {
    testId? :number;
	testName? :string;
	cost? :number;
	lab? :Laboratory;
}

export class PatientInformation{
    constructor(){
        this.doctor = new Doctor();
        this.address = new Address();
        this.bills = new Array<FileDB>();
        this.files = new Array<FileDB>();
        this.tests = new Array<Tests>();
        this.patient = new Patient();
    }
    id? : number;
    email?: string;
    gender?: string;
	disease? :string;
    doctor? :Doctor;
    address? :Address;
    tests? :Tests[];
    files? :FileDB[];
    bills? :FileDB[];
    patient? :Patient;
    doctorPrescription? :string;
}

export class PatientAndPatientInformation {
    constructor(){
        this.patient = new Patient();
        this.patientInformation = new PatientInformation();
    }
    patient? :Patient;
    patientInformation? :PatientInformation
}

export class Address {
    addressId? : number;
	address? :string;
	city? :string;
	state? :string;
	country? :string;
	zipCode? :string;    
	phoneNumber? :string;
}

export class FileDB {
    id? :number;
    name? :string;
    type? :string;
    data? :any[];  
}

export class PatientSearchFilter{
    patientId :any;
    firstName :string;
    lastName :string;
    mobileNumber :string;
    email :string;
}

export class GetTestPatientList {
    patientId? :number
	mobileNumber? :string;
	firstName? :string;
	lastName? :string;
	testId? :any;
	testName? :any;
}

export class GetPatientTestListAndPatientInfo{
    constructor(){
        this.patientInfo = new PatientInformation();
        this.patientTestData = new GetTestPatientList();
    }
    patientInfo : PatientInformation
    patientTestData :GetTestPatientList
}
export class TestPostRequest {
    constructor(){
        this.scanReports = new Array<FileDB>();
        this.bills = new Array<FileDB>();
    }
    patientId? :number;
    patientMobileNo? : string;
    testId? :number;
    testName? :string;
    scanReports? :FileDB[];
    bills? : FileDB[];
}

export class PatientPrescription{
   patientId? :number;
   prescription? :string;
}

export class PatientTests {
    constructor(){
        this.tests = new Array<Tests>();
    }
    patientId? :number;
    tests? : Tests[];
}

export function sortById(a,b){
    let comparison=0;
    if(a.patientId>b.patientId){
        comparison=-1;
    }else if(a.patientId<b.patientId){
        comparison=1;
    }
    return comparison;
  }