import { Component, OnInit } from '@angular/core';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { HttpAppService } from '../utils/http.app.service';
import { Modal } from '../utils/modal/modal.model';
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
  modal : Modal;

  daySchedules : string[];
  isShowingUpcoming : boolean = false;
  isOutToday : boolean[] = [];
  isLoading : boolean = true;

  constructor( private utils : UtilsService , private http : HttpAppService ) { }

  ngOnInit(): void {

    this.faChevron = faChevronDown;
    this.daySchedules = this.utils.getCurrentWeek();
    this.daySchedules = this.daySchedules.slice( this.daySchedules.indexOf( this.getToday() ) , this.daySchedules.length );
    this.daySchedules.forEach( (day) => {
      this.isOutToday.push( true );
    });
    this.initDayOutValues();
    this.modal = new Modal(false,'','','','');
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
    this.modal.setModal( true , 'confirm' , 'Confirm Out?' , 'Are you sure you are out for today?' , index );
  }

  setToOut( index : number ) { // TODO: modify database
    this.isOutToday[ index ] = true;
    
  }

  startLoadingModal() {
    this.modal.setModal( true , 'loading' , 'Deleting Entry' , 'Please wait while the process finishes...' , '' );
  }

  hideModal() {
    this.modal.showMessage = false;
  }

}
