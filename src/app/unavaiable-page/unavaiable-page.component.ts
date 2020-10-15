import { Component, EventEmitter, OnInit } from '@angular/core';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { HttpAppService } from '../utils/http.app.service';
import { UtilsService } from '../utils/utils.service';
import { map, mergeMap } from "rxjs/operators";
import { iif, of } from 'rxjs';

@Component({
  selector: 'app-unavaiable-page',
  templateUrl: './unavaiable-page.component.html',
  styleUrls: ['./unavaiable-page.component.css',
              '../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class UnavaiablePageComponent implements OnInit {  

  // icon variables, fontawesome requirement
  faChevron : any;

  daySchedules : string[]; // array holding current schedules
  isOutToday : boolean[] = []; // boolean array matrix holding whether schedule is out or not

  deleteIndex : number; // holds the current index to delete

  // state variables for UI
  isShowingUpcoming : boolean = false;
  isLoading : boolean = true;

  
  // event emitters for modals
  toggleConfirmEventEmitter : EventEmitter<any>;
  toggleLoadingEventEmitter : EventEmitter<any>;

  constructor( private utils : UtilsService ,
               private httpService : HttpAppService ) { }

  ngOnInit(): void {

    this.faChevron = faChevronDown; // initialize icon
    this.daySchedules = this.utils.getCurrentWeek(); // get current week of current date
    this.daySchedules = this.daySchedules.slice( this.daySchedules.indexOf( this.getToday() ) , this.daySchedules.length ); // truncate list from current date to the end of the week cycle
    this.daySchedules.forEach(() => { // initialize an array element in the boolean array matrix for each date
      this.isOutToday.push( true ); // for each value, set to initially to true
    });
    this.initDayOutValues(); // populate values with data retrieved from the database
    this.toggleConfirmEventEmitter = new EventEmitter();
    this.toggleLoadingEventEmitter = new EventEmitter();
  }

  initDayOutValues() { // set button values with data retrieved from the database
    this.isLoading = true; // set loading status 
    this.httpService.getOutDays().pipe( map( (data) => { // retrieve data from database
      let parsedData = [];
      for( const key in data ) { // convert JSON data into usable format
        parsedData.push( data[key] );
      }
      let stringifyData = [];
      parsedData.forEach( ( schedule : { sched_date : string } ) => { // import data into local array variable 
        stringifyData.push( schedule.sched_date );
      });
      return stringifyData;
    })).subscribe( (data : string[]) => {
      this.daySchedules.filter( day => data.indexOf(day) > -1 ).forEach( (goodDay) => {
        this.isOutToday[ this.daySchedules.indexOf(goodDay) ] = false; // set the out status for each day with appointments
      });
      this.isLoading = false; // set completed loading
    });
  }

  getToday() : string {
    return this.utils.getCurrentDayString(); // get the current date as a string
  }

  triggerOut( index : number ) { // triggers the confirmation dialog for setting the day as out
    this.deleteIndex = index; // set the currently selected date as the one to delete
    this.toggleConfirmEventEmitter.emit('show');
  }

  setToOut( index : number ) {
    const scheduleToOut = this.daySchedules[index];
    var clientPairs : { id : number, contact : string }[] = []; // array to hold client ids and contact info for cancelled day, data stored in a pair object
    this.isLoading = true;
    this.toggleLoadingEventEmitter.emit('show'); // show loading modal
    console.log(`scheduleToOut: ${scheduleToOut}`);
    const setOut = of(2); // initialize dummy varaible to run sequential tasks
    setOut.pipe( // TODO: error handling
      mergeMap((taskCount)=>{ // get ids of client of the specified date
        console.log(`taskCount: ${taskCount}`);
        console.log(`scheduleToOut: ${scheduleToOut}`);
        return this.httpService.getClientContactPairs(scheduleToOut);
      }),
      mergeMap((clientIdData)=>{ // retrieve client ids and contact info from server
        let parsedData = [];
        for( const key in clientIdData ) { // convert JSON data into usable format
          parsedData.push(clientIdData[key]);
        }
        parsedData.forEach((clientObj : {client_id : number, client_number : string }) => {
          clientPairs.push( { id : clientObj.client_id , contact : clientObj.client_number } ); // import data into local variable
        });
        return of(clientPairs);
      }),
      mergeMap((clientPairs)=> iif( () => clientPairs.length > 0 , // if condition rxjs operator, return the observable containing other tasks only if clients for the day are not empty
        this.removeClient(clientPairs.map((client)=>client.id)).pipe( // remove client from active client database
          mergeMap((removeClientStatus)=>{ // fill schedule slots to disable appointment registration
            console.log(`removeClientStatus: ${removeClientStatus}`);
            return this.httpService.updateSchedSlotsForDate(scheduleToOut);
          }),
          mergeMap((updateSchedSlotsForDateStatus)=>{ // send signal to server to send message to all clients regarding rescheduling
            console.log(`updateSchedSlotsForDateStatus: ${updateSchedSlotsForDateStatus}`);
            return this.httpService.sendMovedToReschedMessage(clientPairs.map((client)=>client.contact));
          })    
        ) , of('EMPTY') ))
    ).subscribe((sendMovedToReschedMessageStatus)=>{
      console.log(`sendMovedToReschedMessageStatus: ${sendMovedToReschedMessageStatus}`);
      if( sendMovedToReschedMessageStatus === 'EMPTY' ) // TODO: remove after error handling complete
        console.log(`Sorry, no clients found!!`);
      else
        console.log(`all tasks completed successfully!`);
      this.isLoading = false;
      this.isOutToday[ index ] = true; // update the out status of the selected date in the boolean matrix
      this.toggleLoadingEventEmitter.emit('hide');
    });
  }
  
  removeClient( clientIds : number[] ) { // remove client from the active clients database
    var clientIdsString = ""; // initialize a string of the list of clients for the query
    clientIds.forEach( (clientId) => clientIdsString += `${clientId},`); // add client ids to the string
    clientIdsString = clientIdsString.substring(0,clientIdsString.length-1); // remove the last comma
    return this.httpService.removeClient( clientIdsString ); // send the client ids as pointers for clients to remove in the active clients database
  }
}