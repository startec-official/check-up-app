import { Component, EventEmitter, OnInit } from '@angular/core';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { HttpAppService } from '../utils/http.app.service';
import { UtilsService } from '../utils/utils.service';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-unavaiable-page',
  templateUrl: './unavaiable-page.component.html',
  styleUrls: ['./unavaiable-page.component.css',
              '../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class UnavaiablePageComponent implements OnInit {  

  faChevron : any;

  daySchedules : string[];
  isShowingUpcoming : boolean = false;
  isOutToday : boolean[] = [];
  isLoading : boolean = true;
  deleteIndex : number;
  toggleConfirmEventEmitter : EventEmitter<any>;
  toggleLoadingEventEmitter : EventEmitter<any>;

  constructor( private utils : UtilsService , private http : HttpAppService ) { }

  ngOnInit(): void {

    this.faChevron = faChevronDown;
    this.daySchedules = this.utils.getCurrentWeek();
    this.daySchedules = this.daySchedules.slice( this.daySchedules.indexOf( this.getToday() ) , this.daySchedules.length );
    this.daySchedules.forEach( (day) => {
      this.isOutToday.push( true );
    });
    this.initDayOutValues();
    this.toggleConfirmEventEmitter = new EventEmitter();
    this.toggleLoadingEventEmitter = new EventEmitter();
  }

  initDayOutValues() {
    this.http.getOutDays().pipe( map( (data) => {
      let parsedData = [];
      for( const key in data ) {
        parsedData.push( data[key] );
      }
      let stringifyData = [];
      parsedData.forEach( ( schedule : { sched_date : string } ) => {
        stringifyData.push( schedule.sched_date );
      });
      return stringifyData;
    })).subscribe( (data : string[]) => {
      this.daySchedules.filter( day => data.indexOf(day) > -1 ).forEach( (goodDay) => {
        this.isOutToday[ this.daySchedules.indexOf(goodDay) ] = false;
      });
      this.isLoading = false;
    });
  }

  getToday() : string { 
    return this.utils.getCurrentDayString();
  }

  triggerOut( index : number ) {
    this.deleteIndex = index;
    this.toggleConfirmEventEmitter.emit('show');
  }

  setToOut( index : number ) { // TODO: modify database
    this.isOutToday[ index ] = true; 
    this.toggleLoadingEventEmitter.emit('show');
  }
}
