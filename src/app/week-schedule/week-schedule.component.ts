import { ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { FormArray, FormGroup } from '@angular/forms';
import { AppEntry } from '../utils/app-entry';
import { HttpAppService } from '../utils/http.app.service';
import { FormService } from '../utils/form.service';

@Component({
  selector: 'app-week-schedule',
  templateUrl: './week-schedule.component.html',
  styleUrls: ['./week-schedule.component.css',
              '../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class WeekScheduleComponent implements OnInit {

  daysOfWeek : string[];
  dayFormDisabled : boolean[] = [];
  dayForms : FormArray[] = [];

  personalInfo : FormGroup;
  isLoading : boolean = false;
  
  appEntries : AppEntry[] = [];

  toggleInputErrorModal : EventEmitter<any>;
  toggleReviewModal : EventEmitter<any>;
  toggleLoadingModal : EventEmitter<any>;
  toggleSuccessModal : EventEmitter<any>;
  
  constructor( private utilsService : UtilsService ,
               private httpService : HttpAppService ,
               private formService : FormService,
               private cd : ChangeDetectorRef ) {
  }

  ngOnInit(): void {
    this.daysOfWeek = this.utilsService.getCurrentWeek();

    this.personalInfo = this.formService.generatePersonalForm();

    let i = 0;
    this.daysOfWeek.forEach(day => {
      this.dayFormDisabled[i ++] = false;
      this.dayForms.push( this.formService.generateNewSchedEntryForm( day ) );
    });
    this.toggleInputErrorModal = new EventEmitter();
    this.toggleReviewModal = new EventEmitter();
    this.toggleLoadingModal = new EventEmitter();
    this.toggleSuccessModal = new EventEmitter();
  }

  addGroup( dayForm : FormArray , inputAppDate : string ) {
    dayForm.push( this.formService.generateNewSchedEntryForm(inputAppDate) );
  }

  removeBlock( dayForm : FormArray, index : number ) {
    dayForm.removeAt(index);
  }

  toggleAway( index : number ) {
    this.dayFormDisabled[index] = !this.dayFormDisabled[index];
  }

  onSubmit() {
    let flag = false;
    let i = 0;
    this.cd.detectChanges();
    this.dayForms.forEach( (currentDayForm : FormArray) => {
      var l = currentDayForm.controls.filter(fformControl => fformControl.status == 'INVALID').length; // workaround for the lack of namespaces in the dynamic addition of forms
      if ( l > 0 && !this.dayFormDisabled[i++] ) {
        flag = true;
      }
    });
    // if( flag || !this.personalInfo.valid) {
    //   this.toggleInputErrorModal.emit('show');
    // }
    // else {
    //   this.toggleReviewModal.emit('show');
    //   this.isLoading = true;
    //   this.onConfirmedSubmit();
    // }

    this.toggleReviewModal.emit('show');
    this.isLoading = true;
  }

  onConfirmedSubmit() {
    this.toggleLoadingModal.emit('show');
    this.dayForms.forEach( (currentDayForm : FormArray) => { // TODO: change to pipe function
      currentDayForm.controls.filter( 
        fformControl => fformControl.value.timein !== '' &&
                        fformControl.value.timeout !== ''
      ).forEach( formControl => {
        this.appEntries.push( new AppEntry( formControl.value.appDate , formControl.value.appCount , formControl.value.timein , formControl.value.timeout ) ); 
      });
    });
    console.log(AppEntry.simplify(this.appEntries));
    this.httpService.postScheduleData( AppEntry.simplify(this.appEntries) ).subscribe( (data) => {
      console.log( data );
      this.isLoading = false;
      this.toggleLoadingModal.emit('hide');
      this.toggleSuccessModal.emit('show');
    },
    (error) => {
      throw error;
    });
  }
}