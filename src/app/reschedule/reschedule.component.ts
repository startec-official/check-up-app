import { Component, EventEmitter, OnInit } from '@angular/core';
import { faBan , faEnvelope , faCheckDouble , faArrowRight, faPaperPlane, faAddressBook, faCaretUp, faCaretDown, faSync } from "@fortawesome/free-solid-svg-icons";
import * as moment from 'moment';
import { map } from 'rxjs/operators';
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

  reschedClients : Client[] = [];
  rowSelected : boolean[] = [];
  openDates : { date : string , time : string , slots : number , allSlots : number }[] = [];

  // TODO: set these to null once data has been consumed
  currentSelectedClientIds : number[] = [];
  currentInfoClient : Client;
  currentSelectedDate : { date : string , time : string , slots : number , allSlots : number };
  currentSelectedAction : string;
  rowCount : number = 0;

  faEnvelope : any;
  faBan : any;
  faChevronLeft : any;
  faCheckDouble : any;
  paperPlane : any;
  phoneBook : any;
  faSync : any;

  toggleBatchCancelModal : EventEmitter<string>;
  toggleBatchRescheduleModal : EventEmitter<string>;
  toggleLoadingModal : EventEmitter<string>;
  toggleDateSelectModal : EventEmitter<string>;
  toggleBatchMessageModal : EventEmitter<string>;
  toggleMessageModal : EventEmitter<string>;
  toggleShowInfoModal : EventEmitter<string>;
  toggleActionModal : EventEmitter<string>;
  toggleConnErrorModal : EventEmitter<string>;

  textMessageString : string = "";
  isDoneLoading : boolean = false;

  constructor( private utils : UtilsService,
               private  httpService : HttpAppService ) { }

  ngOnInit(): void {

    this.fetchClients();
    for( var  i = 0 ; i < this.reschedClients.length ; i ++ ) { // initialize selected rows index array
      this.rowSelected[i] = false;
    }
    this.setIcons();
    this.setModals();
    this.currentInfoClient = new Client(-1,'',moment(),'',1,'',''); // initialize dummy variable for client to check info with button
    this.currentSelectedDate = { date : '', time : '' , slots : -1 , allSlots : -1 };
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

  fetchClients() {
    this.isDoneLoading = false;
    this.reschedClients = [];
    this.httpService.getReschedClientData().pipe(map( data => {
      let clientsList = [];
      for ( let key in data ) {
        clientsList.push( data[key] );
      }
      return clientsList;
      })).subscribe( ( clientList ) => {

        clientList.forEach( (clientEl) => {
          this.reschedClients.push( new Client(
            clientEl.client_id,
            clientEl.client_name,
            this.utils.getDateFromFormat(clientEl.client_day,'MM/DD/YYYY'),
            clientEl.client_time,
            parseInt(clientEl.client_order),
            clientEl.client_number,
            clientEl.client_reason
          ));
        });
        this.reschedClients.sort( (a,b) => {
          if( a.date.isBefore( b.date ) )
            return -1;
          if( a.date.isAfter(b.date) )
            return 1;
          return 0;
        });
        this.rowCount = this.reschedClients.length;
        this.isDoneLoading = true;
      });
  }

  // dynamic getters

  getSelectedClients( selectedClientIds : number[] ) : Client[] {
    var selectedClients : Client[] = [];
    for (let index = 0; index < this.reschedClients.length; index++) {
      if( this.rowSelected[index] ) {
        selectedClients.push( this.reschedClients[index] );
      }
    }
    return selectedClients;
  }

  getSelectedClientIds() : number[] {
    var selectedClients : number[] = [];
    for( var i = 0 ; i < this.rowSelected.length ; i ++ ) {
      if( this.rowSelected[i] ) {
        selectedClients.push( this.reschedClients[ i ].userId );
      }
    }
    return selectedClients;
  }

  // static getters

  get selectRowCount() : number {
    return this.rowSelected.filter((val)=>val===true).length;
  }

  get selectedClientNames() : string[] {
    var selectedClients : string[] = [];
    for (let index = 0; index < this.reschedClients.length; index++) {
      if( this.rowSelected[index] ) {
        selectedClients.push( this.reschedClients[index].name );
      }
    }
    return selectedClients;
  }

  // data management functions

  removeFromResched( selectedClientIds : number[] ) {
    this.toggleLoadingModal.emit('show');
    this.httpService.removeReschedClient( selectedClientIds ).subscribe((data) => {
      console.log(data);
      this.refresh();
      this.toggleLoadingModal.emit('hide');
    });
    this.currentSelectedClientIds = null;
  }

  // UI updating functions

  refresh() {
    this.fetchClients();
    this.rowSelected = [];
    for( var  i = 0 ; i < this.reschedClients.length ; i ++ ) { // initialize selected rows index array
      this.rowSelected[i] = false;
    }
  }
 
  selectRow( rowIdx : number ) {
    this.rowSelected[rowIdx] = !this.rowSelected[rowIdx];
  }

  setAllSelected() {
    for( var i = 0 ; i < this.rowCount; i ++ ) {
      this.rowSelected[i] = true;
    }
  }

  clearSelection() {
    for( var i = 0 ; i < this.rowCount; i ++ ) {
      this.rowSelected[i] = false;
    }
  }

  showBatchCancelModal() {
    this.toggleBatchCancelModal.emit('show');
    this.currentSelectedClientIds = this.getSelectedClientIds();
    console.log( this.currentSelectedClientIds );
    
  }

  showBatchRescheduleModal() {
    this.toggleBatchRescheduleModal.emit('show');
  }

  showDateSelectModal() {
    var parsedData = [];
    var openDates = [];
    this.httpService.getOpenDates().subscribe((data)=>{
      for( var key in data ) {
        parsedData.push( data[key] );
      }
      console.log(parsedData);
      parsedData.forEach((result) => {
        openDates.push( { date : result.sched_date , time : result.sched_time, slots : parseInt( result.sched_slots ) - parseInt( result.sched_taken ) , allSlots : parseInt( result.sched_slots )  } );
        this.openDates = openDates.filter( (openDate) => moment(openDate.date,'MMMM Do YYYY, dddd',true).isSameOrAfter( this.utils.getCurrentDate().add(1,'day') , 'date' ) );
      this.toggleDateSelectModal.emit('show');
      }, (err) => {
        this.toggleDateSelectModal.emit('hide');
        this.toggleConnErrorModal.emit('show');
      });
    });
  }

  showBatchMessageModal() {
    this.toggleBatchMessageModal.emit('show');
  }

  showInfoModal( client : Client ) {
    this.currentInfoClient = client;
    this.toggleShowInfoModal.emit('show');
  }

  showMessageModal() {
    this.toggleMessageModal.emit('show');
  }

  showActionSelectModal() {
    this.toggleActionModal.emit('show');
  }

  // event handlers

  onBatchRescheduleConfirmed( action : string ) {
    this.toggleLoadingModal.emit('show');    
    switch( action ) {
      case 'CTR': // TODO: manage race conditions for server writing
        this.currentSelectedClientIds = this.getSelectedClientIds();
        const tempSelectedClients = this.getSelectedClients( this.currentSelectedClientIds ); // TODO: PRIORITY fix callback hell
        var selectedClients : Client[] = []; // get only the names available for the slot
        const limit : number = this.currentSelectedDate.slots < tempSelectedClients.length ? this.currentSelectedDate.slots : tempSelectedClients.length;
        for (let i = 0; i < limit; i++) {
          selectedClients.push(tempSelectedClients[i]);
        }
        this.httpService.postSchedClientsData( selectedClients , moment(this.currentSelectedDate.date,'MMMM Do YYYY, dddd' ,true) , this.currentSelectedDate.time ).subscribe( (data) => {
          console.log(data);
          this.httpService.updateSchedSlot(moment(this.currentSelectedDate.date,'MMMM Do YYYY, dddd',true),this.currentSelectedDate.time , selectedClients.length ).subscribe( (newData) => {
            this.removeFromResched( selectedClients.map( (client) => client.userId ) );
            this.currentSelectedClientIds = null;
          });
        });
        break;
      case 'PRIORITY':
        break;
      default:
        console.log( 'Error' );
    }
    this.currentSelectedAction = null; // set to null to avoid repurposing data
  }

  onBatchCancelConfirmed() {
    this.toggleLoadingModal.emit('show');
    this.currentSelectedClientIds = this.getSelectedClientIds();
    this.removeFromResched( this.currentSelectedClientIds );
  }

  onMessageConfirmed() {
    this.toggleLoadingModal.emit('show');
    setTimeout( () => { // replace with actual code
      this.refresh();
      this.toggleLoadingModal.emit('hide');
    } , 5000 );
  }

  onChosenDate( selectedDate : { date : string, time : string , slots : number , allSlots : number } ) {
    this.currentSelectedDate = selectedDate;
  }

  onChosenAction( action : string ) {
    this.currentSelectedAction = action;
  }
}
