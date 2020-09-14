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
      days.push(moment(weekStart).add(i, 'days').format("MMMM Do,dddd"));
    }
    return days;
  }
}
