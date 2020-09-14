import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { FormArray, FormGroup } from '@angular/forms';
import { AppEntry } from '../utils/app-entry';
import { HttpClient } from '@angular/common/http';
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
  
  appEntries : AppEntry[] = [];

  private utilsService : UtilsService;
  
  constructor( _utilsService : UtilsService ,
               private httpService : HttpAppService ,
               private formService : FormService ) {
    this.utilsService = _utilsService;
  }

  ngOnInit(): void { // TODO: place form processes into service
    this.daysOfWeek = this.utilsService.getCurrentWeek();

    this.personalInfo = this.formService.generatePersonalForm();

    let i = 0;
    this.daysOfWeek.forEach(day => {
      this.dayFormDisabled[i ++] = false;
      this.dayForms.push( this.formService.generateNewSchedEntryForm( day ) );
    });
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
    // let i = 0;
    // this.dayForms.forEach( (currentDayForm : FormArray) => {
    //   if ( currentDayForm.status === 'INVALID' && !this.dayFormDisabled[i++] ) {
    //     flag = true;
    //   }
    // })
    // this.showErrorMessage = ( flag || !this.personalInfo.valid);

    if (!flag) {
      this.dayForms.forEach( (currentDayForm : FormArray) => {
        currentDayForm.controls.forEach( formControl => {
          if ( formControl.value.timein !== "" ) {
            this.appEntries.push( new AppEntry( formControl.value.appDate , formControl.value.appCount , formControl.value.timein , formControl.value.timeout ) ); 
          }
        });
      });
      console.log(`list of app entries:\n${this.appEntries}`);
    }
    this.httpService.postData( AppEntry.simplify(this.appEntries) ); // TODO: clear array after submit
  }
}
