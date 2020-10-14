import { Component, EventEmitter, OnInit } from '@angular/core';
import { faBan , faEnvelope , faIdCard , faCheck , faChevronLeft , faChevronRight , faSync, faAddressBook } from "@fortawesome/free-solid-svg-icons";
import * as moment from 'moment';
import { Moment } from 'moment';
import { of } from 'rxjs';
import { map, mergeMap } from "rxjs/operators";
import { Client } from '../utils/client';
import { HttpAppService } from '../utils/http.app.service';
import { UtilsService } from '../utils/utils.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css',
              '../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class DashboardComponent implements OnInit {
  // TODO: listen to connection lost status

  // icon variables, fontawesome requirement
  faBan : any;
  faEnvelope : any;
  faCheck : any;
  faIdCard : any;
  faChevronLeft : any;
  faChevronRight : any;
  faSync : any;
  faPhoneBook : any;

  // arrays to hold clients and client schedules

  private allClients : Client[] = []; // holds all Clients retrieved from database
  distinctTimesForClientsOfDay = []; // holds clients of date specified
  distinctDates : Moment[] = []; // holds unique dates from client info

  leftDisabled : boolean = true; // disabled button status
  rightDisabled : boolean = false;
  currentDateIndex : number = 0; // current index of date to display

  isDoneLoading : boolean = false; // status of the page loading, for triggering the loading screen
  isEmpty : boolean = true; // status of the client database being empty, for triggering the empty screen

  // button event emitters to show modals
  toggleConfirmDoneApptModal : EventEmitter<any>;
  toggleShowInfoModal : EventEmitter<any>;
  toggleShowCancelTimeBlockModal : EventEmitter<string>;
  toggleShowCancelIndivModal : EventEmitter<string>;
  toggleLoadingModal : EventEmitter<string>;

  // temporary variables for operations
  currentClientToRemove : Client;
  currentClientToCheckInfo : Client;
  currentTimeBlockToRemove : Client[] = [];
  currentOpenSlotInstr : boolean = false;

  constructor( private utils : UtilsService ,
               private httpAppService : HttpAppService ) {}

  ngOnInit(): void {
    
    this.fetchClients();
    this.initModals();
    this.setIcons();
    
    this.rightDisabled = this.distinctDates.length > 1; // disable right button if no other buttons are present
    this.currentDateIndex = 0; // set current displayed date to current one or closest to current date
    this.currentClientToCheckInfo = new Client(0,'',this.utils.getCurrentDate(),'',0,'',''); // initialize current client to check
  }
  
  setIcons() {
    this.faBan = faBan;
    this.faEnvelope = faEnvelope;
    this.faIdCard = faIdCard;
    this.faCheck = faCheck;
    this.faChevronLeft = faChevronLeft;
    this.faChevronRight = faChevronRight;
    this.faSync = faSync;
    this.faPhoneBook = faAddressBook;
  }

  initModals() {
    this.toggleConfirmDoneApptModal = new EventEmitter();
    this.toggleShowInfoModal = new EventEmitter();
    this.toggleShowCancelTimeBlockModal = new EventEmitter();
    this.toggleShowCancelIndivModal = new EventEmitter();
    this.toggleLoadingModal = new EventEmitter();
  }

  fetchClients() { // fetch all active clients from the database
    this.isDoneLoading = false; // set loading to false
    this.httpAppService.getClientData().pipe(map( data => { // retrieve all client info from the database
      let clientsList = [];
      for ( let key in data ) { // map the retrieved JSON object to usable data
        clientsList.push( data[key] );
      }
      return clientsList;
      })).subscribe( ( clientList ) => {

        clientList.forEach( (clientEl) => { // import data into the local variable for all clients
          this.allClients.push( new Client( // initialize client based on Client object schema
            clientEl.client_id,
            clientEl.client_name,
            this.utils.getDateFromFormat(clientEl.client_day,'MM/DD/YYYY'),
            clientEl.client_time,
            parseInt(clientEl.client_order),
            clientEl.client_number,
            clientEl.client_reason
          ));
        });
        this.allClients.sort( (a,b) => {return a.userId - b.userId} ); // sort clients based on userid ascending
        this.distinctDates = this.getDistinctDatesFromNow( this.allClients ); // get distinct dates of registered clients that are on or after the current date
        this.isEmpty = this.distinctDates.length === 0; // determine if there are no clients to display. if so, set empty status and show empty client screen
        this.updateView(); // update dashboard view with clients of current date
        this.isDoneLoading = true;
      });
  }

  getClientsForDate( inputDate : Moment ) { // retrieve all clients that are registered for the input date
    return this.allClients.filter( ( client ) => client.date.isSame(inputDate,'date') );
  }

  getDistinctDatesFromNow( inputClients : Client[] ) { // get an array of distinct dates of registered clients that are on or after the current date
    const distinctDates = [ ...new Set( inputClients.map( (client) => client.date.format() ) )]; // get distinct dates from the list of all clients
    var currentDate = this.utils.getCurrentDate(); // get the current date
    return distinctDates
      .map( ( distinctDate : string ) => moment( distinctDate ) ) // convert distinct dates from string into Moment objects and push into the list to return
      .sort( (a,b) => a.isSameOrAfter(b,'date') ? 1 : -1) // sort the dates by date, in ascending order
      .filter( (date) => date.isSameOrAfter( currentDate , 'date' ) ); // filter for dates that are on or after the current date
  }

  getClientsForDateSepByTime( inputDate : Moment ) { // get an array of clients grouped according to time, for a specified date
    var differentDateTimes = [];
    var clientsForDate = this.getClientsForDate( inputDate ); // get array of clients for the specified date
    const distinctTimes = [ ... new Set( clientsForDate.map( (client) => client.time ))]; // get array of distinct times for the clients of the specified date
    distinctTimes.sort( (a,b) => moment(a.split('-')[0],'hh:mm',true).isSameOrAfter( moment(b.split('-')[0],'hh:mm',true) , 'hour' ) ? 1 : -1 ); // sort the array by time, ascending order
    distinctTimes.forEach( ( uniqueTime ) => {
      differentDateTimes.push( // for each unique time push clients with time equal to the unique time
        clientsForDate.filter( (date) => date.time == uniqueTime )
                      .sort( (a,b) => a.order - b.order ) ); // sort clients by order of registration
    });
    return differentDateTimes;
  }

  updateView() { // assign clients to the variable to trigger change of dashboard view
    this.distinctDates = this.getDistinctDatesFromNow( this.allClients ); // get distinct dates of registered clients that are on or after the current date
    this.distinctTimesForClientsOfDay = this.getClientsForDateSepByTime( this.distinctDates[ this.currentDateIndex ] ); // assigns array of clients of the current date grouped by assigned time
  }

  onConfirmReschedule( clientsToResched : Client[] ) { // moves clients from the active client database to the reschedule clients database
    this.toggleLoadingModal.emit('show'); // show the loading modal
    const clientDate = clientsToResched[0].date; // get the client date, this should be identical for all clients
    const clientTime = clientsToResched[0].time; // get client time, same as above
    const increment = clientsToResched.filter((clientForTime : Client) => !clientForTime.reason.includes( '(PRIORITY)' ) ).length; // counts the number of slots taken up. This is the number of clients without the PRIORITY flag, clients with this flag do not count in taking up slots
    const confirmReschedule = of(4); // dummy observable to hold all functions for confirming schedule
    this.isDoneLoading = false; // set status of starting to load
    this.toggleLoadingModal.emit('show'); // show loading modal
    confirmReschedule.pipe( // TODO: error handling using retry
      mergeMap((taskCount)=>{ // use merge map for sequential observable runs
        console.log('running ' + taskCount + ' tasks...');
        return this.httpAppService.postReschedClientsData(clientsToResched); // transfer client data to the reschedule clients database
      }),
      mergeMap((postReschedStatus)=>{
        console.log("Resched Status:" + postReschedStatus);
        
        return this.removeClient(clientsToResched); // remove clients from the active clients database
      }),
      mergeMap((removedClientStatus) => {
        console.log("Removed Client Status: " + removedClientStatus);
        
        // return this.httpAppService.sendMovedToReschedMessage( clientsToResched.map((client : Client )=> client.contactNumber )); // send signal to device to send message to rescheduled clients
        return of('OK');
      }),
      mergeMap((sendMovedToReschedStatus)=>{
        console.log("send Moved To Resched Status: " + sendMovedToReschedStatus);
        
        return this.httpAppService.updateSchedSlot( clientDate , clientTime , increment * -1 ); // update schedule slots to reflect transfer
      })
    ).subscribe((updateSchedSlotStatus)=>{
      console.log( "updated Sched Slots Status: " + updateSchedSlotStatus);
      
      this.updateForRemovedClients(clientsToResched); // update view for having removed some clients
      console.log('completed all tasks sucessfully!');
      this.isDoneLoading = true; // set status that loading is complete
      this.toggleLoadingModal.emit('hide'); // hide the loading modal
    });
  }

  removeClient( clients : Client[] ) { // remove client from the active clients database
    var clientIdsString = ""; // initialize a string of the list of clients for the query
    clients.forEach( (client) => clientIdsString += `${client.userId},`); // add client ids to the string
    clientIdsString = clientIdsString.substring(0,clientIdsString.length-1); // remove the last comma
    return this.httpAppService.removeClient( clientIdsString ); // send the client ids as pointers for clients to remove in the active clients database
  }

  updateForRemovedClients( removedClients : Client[] ) { // update the view to reflect removed clients
    this.currentTimeBlockToRemove = []; // reset the current time block to remove, in case there was previous data
    removedClients.forEach((client)=> { // for each client, remove them from the array of all clients to synchronize view with database
      const index = this.allClients.indexOf(client);
      this.allClients.splice(index, 1);
    });
    this.isEmpty = this.allClients.length < 1; // check if there are still clients to display
    this.updateView(); // update dashboard view with clients of current date
  }

  showConfirmTimeBlockCancelModal( timeBlock : Client[] ) { // show the confirmation modal for rescheduling the entire time block
    this.currentTimeBlockToRemove = timeBlock; // assign the selected time block as the current time block to remove
    this.toggleShowCancelTimeBlockModal.emit('show'); // show the confirmation modal
  }

  showConfirmIndivCancelModal( client : Client ) { // show the confirmation modal for rescheduling an individual client
    this.currentClientToRemove = client; // assign the selected client as the current client to remove from the view and the array of all clients
    this.toggleShowCancelIndivModal.emit('show'); // show the confirmation modal
  }

  showConfirmDoneApptModal( client : Client ) { // show the confirmation modal for completing an appointment
    this.currentClientToRemove = client; // assign the selected client as the current client to remove from the view and the array of all clients
    this.toggleConfirmDoneApptModal.emit('show'); // show the confirmation modal
  }

  showContactInfoModal( client : Client ) { // show the contact info for the selected client
    this.currentClientToCheckInfo = client; // assign the selected client as the current client to check info
    this.toggleShowInfoModal.emit('show'); // show the information
    
  }

  nextDate() { // move the current view to the next date on button pressed
    this.currentDateIndex += 1; // increment the current index of the date to show
    this.updateView();
  }

  previousDate() { // move the current view to the previous date on button pressed
    this.currentDateIndex -= 1; // decrement the current index of the date to show
    this.updateView();
  }

  refresh() {
    this.allClients = []; // set the array of all items to be empty before populating again
    this.fetchClients(); // get all the clients
    this.currentDateIndex = 0; // set the current date to be displayed to be the first
    this.updateView(); // update dashboard view with clients of current date
  }
}
