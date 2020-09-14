import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { FormArray, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { AppEntry } from '../utils/app-entry';
import { HttpClient } from '@angular/common/http';
import { HttpAppService } from '../utils/http.app.service';

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
  
  constructor( _utilsService : UtilsService , private httpService : HttpAppService ) {
    this.utilsService = _utilsService;
  }

  ngOnInit(): void { // TODO: place form processes into service
    this.daysOfWeek = this.utilsService.getCurrentWeek();

    this.personalInfo = new FormGroup({
      'lastName' : new FormControl('',Validators.required),
      'firstName' : new FormControl('',Validators.required),
      'MI' : new FormControl('',[Validators.required,Validators.maxLength(1)]),
      'specialty' : new FormControl('',Validators.required)
    });

    let i = 0;
    this.daysOfWeek.forEach(day => {
      this.dayFormDisabled[i ++] = false;
      this.dayForms.push( new FormArray([
        new FormGroup({
          appDate : new FormControl( day ),
          timein : new FormControl('',Validators.required),
          timeout : new FormControl('',Validators.required),
          appCount : new FormControl('',Validators.required)
         })
      ]));
    });
  }

  addGroup( dayForm : FormArray , inputAppDate : string ) {
    dayForm.push( new FormGroup({
      appDate : new FormControl( inputAppDate ),
      timein : new FormControl('',Validators.required),
      timeout : new FormControl('',Validators.required),
      appCount : new FormControl('',Validators.required)
    }) );
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
