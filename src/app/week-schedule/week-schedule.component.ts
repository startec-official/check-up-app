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

  // arrays to hold global values
  daysOfWeek : string[]; // holds the days of strings of the day of the week, formatted
  dayFormDisabled : boolean[] = []; // boolean matrix holding whether the forms for each day is enabled or not, toggled when pressing the 'out' button
  dayForms : FormArray[] = []; // array holding all the form array objects for each day

  personalInfo : FormGroup; // form group for personal information
  isLoading : boolean = false; // holds whether page is done loading
  
  appEntries : AppEntry[] = []; // holds the data to be sent to the database

  // event emitters for hiding and showing modals 
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
    this.daysOfWeek = this.utilsService.getCurrentWeek(); // gets the date string of the current week, already formatted
    this.personalInfo = this.formService.generatePersonalForm(); // initiaize the personal info form
    let i = 0;
    this.daysOfWeek.forEach(day => { // initialize the forms for each day
      this.dayFormDisabled[i ++] = false; // set the form to enabled
      this.dayForms.push( this.formService.generateNewSchedEntryForm( day ) ); // initialize the forms for each day and save into array
    });
    // initialize all the event emitters for modals
    this.toggleInputErrorModal = new EventEmitter();
    this.toggleReviewModal = new EventEmitter();
    this.toggleLoadingModal = new EventEmitter();
    this.toggleSuccessModal = new EventEmitter();
  }

  addGroup( dayForm : FormArray , inputAppDate : string ) { // add a row for inputting a time block in the form
    dayForm.push( this.formService.generateNewSchedEntryForm(inputAppDate) ); // initialize the form and add to array, automatically updates display
  }

  removeBlock( dayForm : FormArray, index : number ) { // remove a custom generated time block form row
    dayForm.removeAt(index); // remove for the array, automatically removed from display
  }

  toggleAway( index : number ) { // set the specified form as disabled, triggered when pressing 'out' button
    this.dayFormDisabled[index] = !this.dayFormDisabled[index]; // toggle the state in the boolean matrix
  }

  onSubmit() { // when submit button is pressed, verify form validity and show confirmation modal
    this.cd.detectChanges(); // forces angular to detect changes, needed for forms not declared as NgFormGroup
    let flag = false;
    let i = 0;
    this.dayForms.forEach( (currentDayForm : FormArray) => {
      var l = currentDayForm.controls.filter(fformControl => fformControl.status == 'INVALID').length; // checks if forms are valid, workaround for the lack of namespaces in the dynamic addition of forms
      if ( l > 0 && !this.dayFormDisabled[i++] ) { // if there are invalid forms and they are not disabled, set the flag
        flag = true;
      }
    });
    if( flag || !this.personalInfo.valid) { // check whether all forms and the personal info form are valid 
      this.toggleInputErrorModal.emit('show'); // if invalid, show the error modal
    }
    else {
      this.toggleReviewModal.emit('show'); // if all valid, show confim modal
      this.onConfirmedSubmit(); // trigger database operation
    }
  }

  onConfirmedSubmit() { // sends data to database upon all forms being valid and submit button pressed
    this.isLoading = true; // set loading complete to false
    this.toggleLoadingModal.emit('show'); // show the loading modal
    this.dayForms.forEach( (currentDayForm : FormArray) => { // TODO: change to pipe function
      currentDayForm.controls.filter( // check for forms with entries, those without still pass angular validation so this is necessary
        fformControl => fformControl.value.timein !== '' &&
                        fformControl.value.timeout !== ''
      ).forEach( formControl => {
        this.appEntries.push( new AppEntry( formControl.value.appDate , formControl.value.appCount , formControl.value.timein , formControl.value.timeout ) );  // push the values of the valid entries into the array
      });
    });
    console.log(AppEntry.simplify(this.appEntries)); // converts the entry values into appropriate format
    this.httpService.postScheduleData( AppEntry.simplify(this.appEntries) ).subscribe( (data) => { // write schedule to the database
      console.log( data );
      this.isLoading = false; // set loading as complete
      this.toggleLoadingModal.emit('hide'); // hide the loading modal 
      this.toggleSuccessModal.emit('show'); // show modal on success that asks user to close the window
    },
    (error) => {
      throw error; // TODO: error handling
    });
  }
}