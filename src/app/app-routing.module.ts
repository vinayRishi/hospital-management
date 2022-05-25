import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
import { PatientModes } from './Shared/Enums';
import { AdminComponent } from './admin/admin.component';
import { ReceptionistComponent } from './receptionist/receptionist.component';
import { RadiologistComponent } from './radiologist/radiologist.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PathologistComponent } from './pathologist/pathologist.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  // { path: 'signup', component: CreateComponent},
  { path: 'admin', component:AdminComponent},
  { path: 'receptionist', component:ReceptionistComponent},
  { path: 'radiologist', component:RadiologistComponent},
  { path: 'doctor', component:DoctorComponent},
  { path: 'pathologist', component:PathologistComponent},
//   {
//     path: "patient",
//     children:[
//         {
//             path:"create",
//             component:CreateComponent,
//             data:{mode:PatientModes.CREATE}
//         },
//         {
//           path:"update",
//           component:CreateComponent,
//           data:{mode:PatientModes.UPDATE}
//         },
//          {
//           path:"delete",
//           component:CreateComponent,
//           data:{mode:PatientModes.DELETE}
//         }
//     ]
// },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
