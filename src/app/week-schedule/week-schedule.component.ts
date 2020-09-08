import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-week-schedule',
  templateUrl: './week-schedule.component.html',
  styleUrls: ['./week-schedule.component.css',
              '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'],
})
export class WeekScheduleComponent implements OnInit {

  daysOfWeek : string[];
  
  constructor( utilsService : UtilsService ) {
    this.daysOfWeek = utilsService.getCurrentWeek();
  }

  ngOnInit(): void {
  }

}
