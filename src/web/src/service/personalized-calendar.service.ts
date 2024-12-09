import { Injectable } from '@angular/core';
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PersonalizedCalendarService {

  private fromDateSubject: BehaviorSubject<NgbDate | undefined> = new BehaviorSubject<NgbDate | undefined>(undefined);
  private toDateSubject: BehaviorSubject<NgbDate | undefined> = new BehaviorSubject<NgbDate | undefined>(undefined);
  private applyButtonSubject: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined);


  setFromDate(fromDate: NgbDate | undefined): void {
    this.fromDateSubject.next(fromDate);
  }

  setToDate(toDate: NgbDate | undefined): void {
    this.toDateSubject.next(toDate);
  }

  setApplyButton(applyButton: boolean | undefined): void {
    this.applyButtonSubject.next(applyButton);
  }

  clear(): void {
    this.fromDateSubject.next(undefined);
    this.toDateSubject.next(undefined);
  }

}
