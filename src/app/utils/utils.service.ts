import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  
  getCurrentWeek() {
    var currentDate = moment();
  
    const weekStart = currentDate.clone().startOf('isoWeek');
    const weekEnd = currentDate.clone().endOf('isoWeek');
  
    var days = [];
  
    for (var i = 0; i <= 6; i++) {
      days.push(moment(weekStart).add(i, 'days').format("MMMM Do YYYY, dddd"));
    }
    return days;
  }

  getCurrentDate() {
    return moment();
  }

  getCurrentDateMidnight() {
    return moment(moment().format('MM/DD/YY'),'MM/DD/YY',true);
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

  getDateFromFormat( dateString : string , format : string ) {
    return moment( dateString , format , true );
  }
}
