import { Component, EventEmitter, OnInit } from '@angular/core';
import { faBan , faEnvelope , faCheckDouble , faArrowRight, faPaperPlane, faAddressBook, faSync } from "@fortawesome/free-solid-svg-icons";
import { of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Client } from '../utils/client';
import { HttpAppService } from '../utils/http.app.service';
import { UtilsService } from '../utils/utils.service';

@Component({
  selector: 'app-reschedule',
  templateUrl: './reschedule.component.html',
  styleUrls: ['./reschedule.component.css',
              '../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class RescheduleComponent implements OnInit {

  // arrays to hold clien information
  allReschedClients : Client[] = []; // holds all clients pending for rescheduling
  rowSelected : boolean[] = []; // holds all clients currently selected
  openDates : { date : string , time : string , slots : number , allSlots : number }[] = []; // holds objects of dates available for rescheduling

  // temporary variables for operations
  currentSelectedClientIds : number[] = []; // holds currently selected client ids
  currentSelectedClientNames : string[] = []; /// holds the names of the currently selected clients
  currentInfoClient : Client; // holds currently selected client to view info
  currentSelectedDate : { date : string , time : string , slots : number , allSlots : number }; // holds object for currently selected date to reschedule to
  currentSelectedAction : string = ''; // holds currently selected action choice for rescheduling
  allReschedClientsCount : number = 0; // holds  the number of all
  selectedRowCount : number = 0; // holds the number of currently selected rows
  textMessageString : string = ""; // holds the currently constructed message string for sending messages
  isDoneLoading : boolean = false; // status of page loading completion
  isScheduleOpen : boolean = false;

  // icon variables, fontawesome requirement
  faEnvelope : any;
  faBan : any;
  faChevronLeft : any;
  faCheckDouble : any;
  paperPlane : any;
  phoneBook : any;
  faSync : any;

  // button event emitters to show modals
  toggleBatchCancelModal : EventEmitter<string>;
  toggleBatchRescheduleModal : EventEmitter<string>;
  toggleLoadingModal : EventEmitter<string>;
  toggleDateSelectModal : EventEmitter<string>;
  toggleBatchMessageModal : EventEmitter<string>;
  toggleMessageModal : EventEmitter<string>;
  toggleShowInfoModal : EventEmitter<string>;
  toggleActionModal : EventEmitter<string>;
  toggleConnErrorModal : EventEmitter<string>;

  constructor( private dateTimeUtils : UtilsService,
               private  httpService : HttpAppService ) { }

  ngOnInit(): void {

    this.fetchClients(); // get the clients to populate the reschedule pane
    this.setIcons();
    this.setModals();
    for( var  i = 0 ; i < this.allReschedClients.length ; i ++ ) { // initialize array of selected row indices
      this.rowSelected[i] = false;
    }
    this.currentInfoClient = new Client(-1,'',this.dateTimeUtils.getCurrentDate(),'',1,'','',''); // initialize dummy variable for client to check info with button
    this.currentSelectedDate = { date : '', time : '' , slots : -1 , allSlots : -1 }; // initialize dummy variable for current selected date
  }

  setIcons() {
    this.faEnvelope = faEnvelope;
    this.faBan = faBan;
    this.faChevronLeft = faArrowRight;
    this.faCheckDouble = faCheckDouble;
    this.paperPlane = faPaperPlane;
    this.phoneBook = faAddressBook;
    this.faSync = faSync;
  }

  setModals() {
    this.toggleBatchCancelModal = new EventEmitter();
    this.toggleBatchRescheduleModal = new EventEmitter();
    this.toggleLoadingModal = new EventEmitter();
    this.toggleDateSelectModal = new EventEmitter();
    this.toggleMessageModal = new EventEmitter();
    this.toggleBatchMessageModal = new EventEmitter();
    this.toggleShowInfoModal = new EventEmitter();
    this.toggleActionModal = new EventEmitter();
    this.toggleConnErrorModal = new EventEmitter();
  }

  fetchClients() { // get clients to be rescheduled from the database
    this.isDoneLoading = false;
    this.allReschedClients = []; // clear the array to avoid duplicate entries
    this.httpService.getReschedClientData().pipe(map( data => { // retrieve the clients from the reschedule clients database 
      let clientsList = [];
      for ( let key in data ) { // convert the retrieved JSON data into a usable format
        clientsList.push( data[key] );
      }
      return clientsList;
      })).subscribe( ( clientList ) => {

        clientList.forEach( (clientEl) => { // import data into local variable for all clients
          this.allReschedClients.push( new Client( // // initialize client based on Client object schema
            clientEl.client_id,
            clientEl.client_name,
            this.dateTimeUtils.getMomentObjectFromFormat(clientEl.client_day,'MM/DD/YYYY'),
            clientEl.client_time,
            parseInt(clientEl.client_order),
            clientEl.client_number,
            clientEl.client_code,
            clientEl.client_reason
          ));
        });
        this.allReschedClients.sort( (a,b) => { // sort the clients by date, ascending orer
          if( a.date.isBefore( b.date ) )
            return -1;
          if( a.date.isAfter(b.date) )
            return 1;
          return 0;
        });
        this.allReschedClientsCount = this.allReschedClients.length; // set the total number of clients in the database to the variable 
        this.selectedRowCount = this.getselectedRowCount(); // set the current number of selected rows to the variable
        this.isDoneLoading = true; // set status of page completion
      });
  }

  getSelectedClients() : Client[] { // get the array of selected client objects from the array of the indices of selected rows
    var selectedClients : Client[] = [];
    for (let posIndex = 0; posIndex < this.allReschedClients.length; posIndex++) {
      if( this.rowSelected[posIndex] ) { // check if the row is currently selected
        selectedClients.push( this.allReschedClients[posIndex] ); // push the id into the array by referencing the client object in the list of all clients using the same index. this works because the clients are saved in the array in the same order as they are displayed
      }
    }
    return selectedClients;
  }

  getSelectedClientIds() : number[] { // get the array of selected client ids from the array of selected rows
    var selectedClients : number[] = [];
    for( var posIndex = 0 ; posIndex < this.rowSelected.length ; posIndex ++ ) {
      if( this.rowSelected[posIndex] ) {
        selectedClients.push( this.allReschedClients[posIndex].userId );
      }
    }
    return selectedClients;
  }

  getselectedRowCount() : number { // get the number of selected rows
    return this.rowSelected.filter((val)=>val===true).length;
  }

  getSelectedClientNames() : string[] { // get the array of client names from the selected rows
    var selectedClients : string[] = [];
    for (let posIndex = 0; posIndex < this.allReschedClients.length; posIndex++) {
      if( this.rowSelected[posIndex] ) {
        selectedClients.push( this.allReschedClients[posIndex].name );
      }
    }
    return selectedClients;
  }

  removeFromResched( selectedClientIds : number[] ) { // remove clients from the list of 
    return this.httpService.removeReschedClient( selectedClientIds );
  }

  updateAfterRemove() { // update the view of clients to reschedule to match database entries
    const clientsToRemove = this.getSelectedClients(); // get selected clients
    clientsToRemove.forEach((client) =>{  // remove clients from the array of all clients to reschedule
      const indexToRemove = this.allReschedClients.indexOf(client);
      this.allReschedClients.splice(indexToRemove,1);
    });
    this.rowSelected = [];
    for( var  i = 0 ; i < this.allReschedClients.length ; i ++ ) { // reinitialize selection array with the new values
      this.rowSelected[i] = false; // also clears selection
    }
    this.allReschedClientsCount = this.allReschedClients.length; // update number of entries
  }
 
  selectRow( rowIdx : number ) { // select a client on row click
    this.rowSelected[rowIdx] = !this.rowSelected[rowIdx]; // toggle selection for the current row
    this.selectedRowCount = this.getselectedRowCount(); // update the number of rows selected
  }

  selectAllClients() {
    for( var i = 0 ; i < this.allReschedClientsCount; i ++ ) {
      this.rowSelected[i] = true;
    }
    this.selectedRowCount = this.getselectedRowCount();
  }

  clearSelection() {
    for( var i = 0 ; i < this.allReschedClientsCount; i ++ ) {
      this.rowSelected[i] = false;
    }
  }

  refresh() {
    this.fetchClients();
  }

  showBatchCancelModal() { // show cancellation modal
    this.currentSelectedClientNames = this.getSelectedClientNames(); // set current names to populate inside the modal
    this.toggleBatchCancelModal.emit('show'); // show the modal
  }

  showBatchRescheduleModal() {
    this.currentSelectedClientNames = this.getSelectedClientNames(); // set current names to populate list inside the modal
    this.toggleBatchRescheduleModal.emit('show'); // show the modal
  }

  showDateSelectModal() { // show the modal to select dates for rescheduling
    this.currentSelectedClientNames = this.getSelectedClientNames(); // set current names to populate list inside the modal
    var parsedData = [];
    this.openDates = [];
    this.httpService.getOpenDates().subscribe((data)=>{ // get list of dates with available slots from the database
      for( var key in data ) { // convert the retrieved JSON data into a usable format
        parsedData.push( data[key] );
      }
      parsedData.forEach((result) => { // import data into local variable
        this.openDates.push({ // map data to match date object
             date : result.sched_date,
             time : result.sched_time,
             slots : parseInt( result.sched_slots ) - parseInt( result.sched_taken ),
             allSlots : parseInt( result.sched_slots )  
          });
      });
      console.log(this.openDates);
      this.openDates = this.openDates.filter(  // filter for dates on or before current dates
        (openDate) => this.dateTimeUtils.isStringFormatSameOrAfterToday( openDate.date , 'MMMM Do YYYY, dddd' , 'date' , 1 , 'day' )
      ).sort( (a,b) => { // sort the dates in ascending order
        return this.dateTimeUtils.isStringFormatSameOrAfter(  a.date , b.date , 'MMMM Do YYYY, dddd' , 'date' ) ? 1 : -1;
      });
      this.isScheduleOpen = this.openDates.length > 0; // check if an open schedule is available
      this.toggleDateSelectModal.emit('show'); // show the date selection modal
    });
  }

  showBatchMessageModal() { // show batch messsage sending modal
    this.currentSelectedClientNames = this.getSelectedClientNames(); // set current names to populate list inside the modal
    this.toggleBatchMessageModal.emit('show'); // show the modal
  }

  showInfoModal( client : Client ) { // show the modal containing client information
    this.currentInfoClient = client; // set currently selected client as the client to display
    this.toggleShowInfoModal.emit('show'); // show the modal
  }

  showMessageModal() { // show the message send modal
    this.toggleMessageModal.emit('show'); // show the modal
  }

  showActionSelectModal() { // show the modal to choose what action to take in rescheduling
    this.currentSelectedClientNames = this.getSelectedClientNames(); // set current names to populate list inside the modal
    this.toggleActionModal.emit('show'); // show the modal
  }

  // event handlers

  onBatchRescheduleConfirmed( action : string ) { // assign a new date and time for client appointment and transfer back to active clients database
    this.isDoneLoading = false;
    this.toggleLoadingModal.emit('show'); // show the loading modal
    switch( action ) { // determine action based on selection
      case 'CTR': // TODO: manage race conditions for server writing
        this.currentSelectedClientIds = this.getSelectedClientIds(); // get the ids of selected clients
        const tempSelectedClients = this.getSelectedClients(); // store clients in a temporary variable for processing
        const selectedDate = this.dateTimeUtils.getMomentObjectFromFormat( this.currentSelectedDate.date , 'MMMM Do YYYY, dddd' ); // convert currently selected date into Moment object
        var selectedClients : Client[] = []; // get only the names available for the slot
        const limit : number = this.currentSelectedDate.slots < tempSelectedClients.length ? 
                                this.currentSelectedDate.slots : tempSelectedClients.length; // assign the number of slots to provide to the limit. If number of selected clients exceed the number of slots, only allocate the number of remaining slots
        var increment = 0;
        for (let i = 0; i < limit; i++) { // iterate over selected clients until the determined limit
          if( !tempSelectedClients[i].reason.includes('(PRIORITY)') ) // if client does not have the priority flag, count to the number of slots taken
            increment += 1;
          selectedClients.push(tempSelectedClients[i]); // push clients only until the determined limit
        }
        const ctrResched = of(4); // set dummy observable to run all sequential tasks
        ctrResched.pipe( // TODO: error handling
          mergeMap((taskCount)=>{ // insert client data into active clients database
            console.log(`starting ${taskCount} tasks...`);
            return this.httpService.postSchedClientsData( selectedClients , selectedDate , this.currentSelectedDate.time );
          }),
          mergeMap((postSchedClientsStatus)=>{ // update the number schedule slots avaiable
            console.log(`postSchedClientsStatus: ${postSchedClientsStatus}`);
            return this.httpService.updateSchedSlot(selectedDate,this.currentSelectedDate.time , increment );
          }),
          mergeMap((updateSchedSlotStatus)=>{ // remove the client entries from the reschedule database
            console.log(`updateSchedSlotStatus: ${updateSchedSlotStatus}`);
            return this.removeFromResched( selectedClients.map( (client) => client.userId ) );
          }),
          mergeMap((removeFromReschedStatus)=>{ // send a signal to the server to send a message to rescheduled clients
            console.log(`removeFromReschedStatus: ${removeFromReschedStatus}`);
            return this.httpService.sendReschedMessage( selectedDate ,
              this.currentSelectedDate.time ,
              selectedClients.map((client)=>client.contactNumber) ,
              selectedClients.map((client)=> client.code ));
          })
        ).subscribe((sendReschedMessageStatus)=>{
          console.log(`sendReschedMessageStatus: ${sendReschedMessageStatus}`);
          this.updateAfterRemove(); // update the view of clients to reschedule to match database entries 
          console.log(`all tasks completed successfully!`);
          this.isDoneLoading = true;
          this.toggleLoadingModal.emit('hide'); // hide the loading modal
        });
        break;
      case 'PRIORITY': // case for handling clients outside of the queue
        var selectedClients : Client[] = this.getSelectedClients(); // get client objects of selected client rows
        selectedClients.forEach( (client : Client) => {
          if( !client.reason.includes('PRIORITY') ) // add the priority flag to selected clients. This change is permanent
            client.reason = `(PRIORITY) ${client.reason}`; // prepend the flag in the client's reason
        });
        const priorResched = of(3); // set dummy observable to run all sequential tasks
        priorResched.pipe( // TODO: error handling
          mergeMap((taskCount)=>{ // insert client data into active clients database
            console.log(`started ${taskCount} tasks...`);
            return this.httpService.postSchedClientsData( selectedClients , this.dateTimeUtils.getMomentObjectFromFormat( this.currentSelectedDate.date , 'MMMM Do YYYY, dddd' ) , this.currentSelectedDate.time );
          }),
          mergeMap((postSchedClientsDataStatus)=>{  // remove the client entries from the reschedule database
            console.log(`postSchedClientsDataStatus: ${postSchedClientsDataStatus}`);
            return this.removeFromResched( selectedClients.map( (client) => client.userId ) );
          }),
          mergeMap((removeFromReschedStatus)=>{
            console.log(`removeFromReschedStatus: ${removeFromReschedStatus}`);
            return this.httpService.sendReschedMessage( selectedDate ,
              this.currentSelectedDate.time ,
              selectedClients.map((client)=>client.contactNumber) ,
              selectedClients.map((client)=> client.code ));
          })
        ).subscribe((sendReschedMessage)=>{
          console.log(`sendReschedMessage: ${sendReschedMessage}`);
          this.updateAfterRemove(); // update the view of clients to reschedule to match database entries 
          console.log(`all tasks completed successfully!`);
          this.isDoneLoading = true;
          this.toggleLoadingModal.emit('hide'); // hide the loading modal
        });
        break;
      default:
        console.log( 'Error' );
    }
    this.currentSelectedAction = null; // set to null to avoid repurposing data
  }

  onBatchCancelConfirmed() { // permanently cancels selected clients and removes them from the view
    this.isDoneLoading = false;
    this.toggleLoadingModal.emit('show'); // show the loading modal
    this.currentSelectedClientIds = this.getSelectedClientIds(); // get the ids of the selected clients
    let selectedClients = this.getSelectedClients();
    const permCancel = of(2); // set dummy observable to run all sequential tasks
    permCancel.pipe( // TODO: error handling
      mergeMap((taskCount)=>{
        console.log(`started ${taskCount} tasks...`); // send signal to server to send message to all clients about permanent cancellation
        return this.httpService.sendCancelledMessage( selectedClients.map((client)=>client.contactNumber) );
      }),
      mergeMap((sendCancelledMessageStatus)=>{ // remove clients from the array and the view to match database
        console.log(`sendCancelledMessageStatus: ${sendCancelledMessageStatus}`);
        return this.removeFromResched(this.currentSelectedClientIds);
      })
    ).subscribe((removeFromReschedStatus)=>{
      console.log(`removeFromReschedStatus: ${removeFromReschedStatus}`);
      console.log(`all tasks completed successfully!`);
      this.updateAfterRemove();
      this.isDoneLoading = true;
      this.toggleLoadingModal.emit('hide'); // hide the loading modal
    });
  }

  onMessageConfirmed( message : string ) { // sends the custom message to the server to send to currently selected clients 
    this.toggleLoadingModal.emit('show'); // show loading modal
    this.currentSelectedClientIds = this.getSelectedClientIds(); // get ids of selected clients
    const selectedClients = this.getSelectedClients(); // get client objects of selected clients
    this.httpService.sendCustomMessage( message , selectedClients.map( (client) => client.contactNumber ) ).subscribe((sendCustomMessageStatus)=>{ // send signal to server to send the message
      console.log(`sendCustomMessageStatus: ${sendCustomMessageStatus}`);
      this.toggleLoadingModal.emit('hide');
    });
  }

  onChosenDate( selectedDate : { date : string, time : string , slots : number , allSlots : number } ) {
    this.currentSelectedDate = selectedDate; // sets the current date to the one selected in the modal
  }

  onChosenAction( action : string ) {
    this.currentSelectedAction = action; // sets the current action to the one selected in the modal
  }
}
