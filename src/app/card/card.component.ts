import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientModes } from '../Shared/Enums';
import { UserService } from '../user.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() users: any;
  @Output() userId: EventEmitter<any> = new EventEmitter();
  @Output() roleId: EventEmitter<any> = new EventEmitter();
  showError: boolean = false;
  showSuccess: boolean = false;
  public modes = { addMode:false, editMode:false, deleteMode:false};
  constructor(
    private router: Router,
    private userService: UserService,
    private activatedRoute : ActivatedRoute) { }
  ngOnInit() {
  }

  navigateEdit(userId, roleId) {
    this.router.navigate(["edit", userId, roleId]);
  }

  getActiveParams(){
    this.activatedRoute.data.subscribe(x=>{
      if(x){
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
  deleteUser(userId, roleId) {
    // console.log(roleId);
    if (roleId == 2) {
      // let observable = this.userService.deletePatient(userId);
      // observable.subscribe((response) =>
      // console.log(response)
      // )
      this.userId.emit(userId);
      this.roleId.emit(roleId);
      this.showError = false;
      this.showSuccess = true;
    } else if (roleId == 3) {
      // console.log(userId);
      // let observable = this.userService.deleteDoctor(userId);
      // observable.subscribe((response) =>
      // console.log(response)
      // )
      this.userId.emit(userId);
      this.roleId.emit(roleId);
      this.showError = false;
      this.showSuccess = true;
    }
  }

}
