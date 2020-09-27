import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  generatePersonalForm() {
    return new FormGroup({
      'lastName' : new FormControl('',Validators.required),
      'firstName' : new FormControl('',Validators.required),
      'MI' : new FormControl('',[Validators.required,Validators.maxLength(1)]),
      'specialty' : new FormControl('',Validators.required)
    });
  }

  generateNewSchedEntryForm( day? : string ,
                             timeindef? : string ,
                             timeoutdef? : string ,
                             appCountdef? : number ) : FormArray {
    return new FormArray([
      new FormGroup({
        appDate : new FormControl( ( day || '' ) ),
        timein : new FormControl( (timeindef || '') ,Validators.required),
        timeout : new FormControl( (timeoutdef || '') ,Validators.required),
        appCount : new FormControl( (appCountdef || '') ,Validators.required)
       },Validators.required)
    ])
  }
}
