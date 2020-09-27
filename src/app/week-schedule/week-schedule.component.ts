import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { FormArray, FormGroup } from '@angular/forms';
import { AppEntry } from '../utils/app-entry';
import { HttpAppService } from '../utils/http.app.service';
import { FormService } from '../utils/form.service';

@Component({
  selector: 'app-week-schedule',
  templateUrl: './week-schedule.component.html',
  styleUrls: ['./week-schedule.component.css',
              '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'],
})
export class WeekScheduleComponent implements OnInit {
  
  daysOfWeek : string[];
  dayFormDisabled : boolean[] = [];
  dayForms : FormArray[] = [];

  personalInfo : FormGroup;
  showErrorMessage : boolean = false;
  showReviewMessage : boolean = false;
  isLoading : boolean = false;
  
  appEntries : AppEntry[] = [];

  private utilsService : UtilsService;
  
  constructor( _utilsService : UtilsService ,
               private httpService : HttpAppService ,
               private formService : FormService,
               private cd : ChangeDetectorRef ) {
    this.utilsService = _utilsService;
  }

  ngOnInit(): void {
    this.daysOfWeek = this.utilsService.getCurrentWeek();

    this.personalInfo = this.formService.generatePersonalForm();

    let i = 0;
    this.daysOfWeek.forEach(day => {
      this.dayFormDisabled[i ++] = false;
      this.dayForms.push( this.formService.generateNewSchedEntryForm( day ) );
    });
    console.log( this.dayFormDisabled );
  }

  addGroup( dayForm : FormArray , inputAppDate : string ) {
    dayForm.push( this.formService.generateNewSchedEntryForm(inputAppDate) );
  }

  removeBlock( dayForm : FormArray, index : number ) {
    dayForm.removeAt(index);
  }

  toggleAway( index : number ) {
    this.dayFormDisabled[index] = !this.dayFormDisabled[index];
    console.log(this.dayFormDisabled);
    
  }

  onSubmit() {
    let flag = false;
    let i = 0;
    this.cd.detectChanges();
    this.dayForms.forEach( (currentDayForm : FormArray) => {
      var l = currentDayForm.controls.filter(fformControl => fformControl.status == 'INVALID').length;
      if ( l > 0 && !this.dayFormDisabled[i++] ) {
        console.log(`form at index ${i-1}`);
        flag = true;
      }
    });
    if( flag || !this.personalInfo.valid) {
      this.showErrorMessage = true;
    }
    else {
      this.showReviewMessage = false;
      this.isLoading = true;
      this.onConfirmedSubmit();
    }
  }

  onConfirmedSubmit() {
    this.dayForms.forEach( (currentDayForm : FormArray) => { // TODO: change to pipe function
      currentDayForm.controls.filter( 
        fformControl => fformControl.value.timein !== '' &&
                        fformControl.value.timeout !== ''
      ).forEach( formControl => {
        this.appEntries.push( new AppEntry( formControl.value.appDate , formControl.value.appCount , formControl.value.timein , formControl.value.timeout ) ); 
      });
    });
    console.log(AppEntry.simplify(this.appEntries));
    this.httpService.postData( AppEntry.simplify(this.appEntries) ).subscribe( (data) => {
      console.log( data );
      this.isLoading = false;
      console.log( `isLoading is ${this.isLoading}` );
    },
    (error) => {
      throw error;
    });
    this.showReviewMessage = false;
  }
}
