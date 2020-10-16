import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  
  getCurrentWeek() {
    var currentDate = moment();
      
    const weekStart = currentDate.clone().startOf('isoWeek');
  
    var days = [];
  
    for (var i = 0; i <= 6; i++) {
      days.push(moment(weekStart).add(i, 'days').format("MMMM Do YYYY, dddd"));
    }
    return days;
  }

  getCurrentDate() {
    return moment();
  }

  getCurrentDayString() {
    return moment().format("MMMM Do YYYY, dddd");
  }

  getDateFromAmericanString(amString : string) {
    const amStringBreak = amString.split('/');
    const amStringMonth = amStringBreak[0].length < 2 ? `0${amStringBreak[0]}` : amStringBreak[0];
    const amStringDay = amStringBreak[1].length < 2 ? `0${amStringBreak[1]}` : amStringBreak[1];
    const amStringYear = amStringBreak[2].length < 4 ? `20${amStringBreak[2]}` : amStringBreak[2];
    const amStringFinal = `${amStringMonth}/${amStringDay}/${amStringYear}`;    
    return moment( amStringFinal , 'MM/DD/YYYY' , true ).format("MMMM Do YYYY, dddd");
  }

  getMomentObjectFromFormat( dateString : string , format : string ) {
    return moment( dateString , format , true );
  }

  getMomentObjectFromISO( inputString : string ) : Moment {
    return moment(inputString);
  }

  convertMomentISOToString( inputMoment : Moment ) : string {
    return inputMoment.format();
  }

  isStringFormatSameOrAfter( _dateTimeA : string , _dateTimeB : string , format : string , dateTimeUnit : moment.unitOfTime.StartOf ) : boolean {
    const dateTimeA = moment( _dateTimeA , format , true );
    const dateTimeB = moment( _dateTimeB , format , true );
    return dateTimeA.isSameOrAfter( dateTimeB  , dateTimeUnit );
  }

  isStringFormatSameOrAfterToday( _dateTimeA : string , format : string , dateTimeUnit : moment.unitOfTime.StartOf , period? : number , periodUnit? : moment.unitOfTime.DurationConstructor ) : boolean {
    const dateTimeA = moment( _dateTimeA , format , true );
    const dateTimeB = this.getCurrentDate();
    if (period === undefined || periodUnit === undefined )
      return dateTimeA.isSameOrAfter( dateTimeB  , dateTimeUnit ); 
    return dateTimeA.isSameOrAfter( dateTimeB.add(period,periodUnit) , dateTimeUnit );
  }

}