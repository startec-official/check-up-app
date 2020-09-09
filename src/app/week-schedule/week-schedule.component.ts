import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UtilsService } from '../utils.service';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

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

  private utilsService : UtilsService;
  
  constructor( _utilsService : UtilsService ) {
    this.utilsService = _utilsService;
  }

  ngOnInit(): void {
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
          timein : new FormControl('',Validators.required),
          timeout : new FormControl('',Validators.required),
          appCount : new FormControl('',Validators.required)
         })
      ]));
    });
  }

  addGroup( dayForm : FormArray ) {
    dayForm.push( new FormGroup({
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
    let i = 0;
    this.dayForms.forEach( (currentDayForm : FormArray) => {
      if ( currentDayForm.status === 'INVALID' && !this.dayFormDisabled[i++] ) {
        flag = true;
      }
    })
    this.showErrorMessage = ( flag || !this.personalInfo.valid);
  }
}
