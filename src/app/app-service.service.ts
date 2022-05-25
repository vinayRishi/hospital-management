import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  
  private userDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  userLoggedIn$: Observable<any> = this.userDataSubject.asObservable();
  constructor() {

   }


   userLoggedIndata(changes){
    this.userDataSubject.next(changes);
  }

}
