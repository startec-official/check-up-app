import { Component, ElementRef, EventEmitter, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { faBan , faEnvelope , faIdCard , faCheck , faChevronLeft , faChevronRight , faSync, faAddressBook } from "@fortawesome/free-solid-svg-icons";
import * as moment from 'moment';
import { Moment } from 'moment';
import { map } from "rxjs/operators";
import { ModModalComponent } from '../mod-modal/mod-modal.component';
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

  faBan : any;
  faEnvelope : any;
  faCheck : any;
  faIdCard : any;
  faChevronLeft : any;
  faChevronRight : any;
  faSync : any;
  faPhoneBook : any;

  private allClients : Client[] = [];
  distinctTimesForClientsOfDay = [];
  distinctDates : Moment[] = [];

  leftDisabled : boolean = true;
  rightDisabled : boolean = false;
  currentDateIndex :number = 0;

  isDoneLoading : boolean = false;
  isEmpty : boolean = true;

  toggleConfirmDoneApptModal : EventEmitter<any>;
  toggleShowInfoModal : EventEmitter<any>;
  toggleShowCancelTimeBlockModal : EventEmitter<string>;
  toggleShowCancelIndivModal : EventEmitter<string>;
  toggleLoadingModal : EventEmitter<string>;

  currentClientToRemove : Client;
  currentClientToCheckInfo : Client;
  currentTimeBlockToRemove : Client[] = [];
  currentOpenSlotInstr : boolean = false;

  constructor( private utils : UtilsService , private httpAppService : HttpAppService , private ngZone : NgZone ) { }

  ngOnInit(): void {
    
    this.fetchClients();
    this.rightDisabled = this.distinctDates.length > 1;
    this.currentDateIndex = 0;
    this.toggleConfirmDoneApptModal = new EventEmitter();
    this.toggleShowInfoModal = new EventEmitter();
    this.toggleShowCancelTimeBlockModal = new EventEmitter();
    this.toggleShowCancelIndivModal = new EventEmitter();
    this.toggleLoadingModal = new EventEmitter();
    this.currentClientToCheckInfo = new Client(0,'',this.utils.getCurrentDate(),'',0,'','');
    this.setIcons();
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

  fetchClients() {
    this.isDoneLoading = false;
    this.httpAppService.getClientData().pipe(map( data => {
      let clientsList = [];
      for ( let key in data ) {
        clientsList.push( data[key] );
      }
      return clientsList;
      })).subscribe( ( clientList ) => {

        clientList.forEach( (clientEl) => {
          this.allClients.push( new Client(
            clientEl.client_id,
            clientEl.client_name,
            this.utils.getDateFromFormat(clientEl.client_day,'MM/DD/YYYY'),
            clientEl.client_time,
            parseInt(clientEl.client_order),
            clientEl.client_number,
            clientEl.client_reason
          ));
        });
        this.allClients.sort( (a,b) => {return a.userId - b.userId} );
        this.distinctDates = this.getDistinctDatesFromNow( this.allClients );
        this.isEmpty = this.distinctDates.length === 0;
        this.updateView();
        this.isDoneLoading = true;
      });
  }

  getClientsForDate( inputDate : Moment ) {
    return this.allClients.filter( ( client ) => client.date.isSame(inputDate,'date') );
  }

  getDistinctDatesFromNow( inputClients : Client[] ) {
    const distinctDates = [ ...new Set( inputClients.map( (client) => client.date.format() ) )];
    var currentDate = this.utils.getCurrentDate();
    return distinctDates.map( ( distinctDate : string ) => moment( distinctDate ) ).sort( (a,b) => a.isSameOrAfter(b,'date') ? 1 : -1).filter( (date) => date.isSameOrAfter( currentDate , 'date' ) );
    
  }

  getClientsForDateSepByTime( inputDate : Moment ) {
    var differentDateTimes = [];
    var clientsForDate = this.getClientsForDate( inputDate );
    const distinctTimes = [ ... new Set( clientsForDate.map( (client) => client.time ))];
    distinctTimes.sort( (a,b) => moment(a.split('-')[0],'hh:mm',true).isSameOrAfter( moment(b.split('-')[0],'hh:mm',true) , 'hour' ) ? 1 : -1 );
    console.log( distinctTimes );
    distinctTimes.forEach( ( uniqueTime ) => {
      differentDateTimes.push( clientsForDate.filter( (date) => date.time == uniqueTime ).sort( (a,b) => a.order - b.order ) );
    });
    return differentDateTimes;
  }

  updateView() {
    this.distinctTimesForClientsOfDay = this.getClientsForDateSepByTime( this.distinctDates[ this.currentDateIndex ] );
  }

  onConfirmRescheduleForTime( distinctTime : Client[] ) { // TODO: ask if going to keep the slot or going to remove
    this.toggleLoadingModal.emit('show');
    const clientDate = distinctTime[0].date;
    const clientTime = distinctTime[0].time;
    var clientsToResched = [];
    distinctTime.forEach(( clientForTime : Client ) => {
      clientsToResched.push( clientForTime );
    });
    this.httpAppService.postReschedClientsData( clientsToResched ).subscribe( (data) => {
      console.log( data );
      this.currentTimeBlockToRemove = [];
      this.removeClient( clientsToResched );
    });

    if( !this.currentOpenSlotInstr ) {
      console.log( 'I was executed!' );
      
      this.httpAppService.updateSchedSlot( clientDate , clientTime , distinctTime.length * -1 ).subscribe((data)=>{
        console.log(data);
      });
    }
  }

  onConfirmRescheduleIndivClient( selectedClient : Client ) {
    this.isDoneLoading = false;
    this.httpAppService.postReschedClientsData( [selectedClient] ).subscribe((data)=>{
      this.removeClient( [selectedClient] );
    });
    if( !this.currentOpenSlotInstr ) {
      console.log( 'I was executed indiv!' );
      
      this.httpAppService.updateSchedSlot( selectedClient.date , selectedClient.time , -1 ).subscribe((data)=>{
        console.log(data);
      });
    }
  }

  removeClient( clients : Client[] ) {
    this.isDoneLoading = false;
    this.toggleLoadingModal.emit('show');
    var clientIdsString = "";
    clients.forEach( (client) => clientIdsString += `${client.userId},`);
    clientIdsString = clientIdsString.substring(0,clientIdsString.length-1);
    console.log(clientIdsString);
    this.httpAppService.removeClient( clientIdsString ).subscribe((data) => {    
        console.log(data);
        clients.forEach((client)=> { // TODO: change to refresh
          const index = this.allClients.indexOf(client);
          this.allClients.splice(index, 1);
        });
        this.isEmpty = this.allClients.length < 1;
        this.updateView();
        this.isDoneLoading = true;
        this.toggleLoadingModal.emit('hide');
      }
    );
  }

  showConfirmTimeBlockCancelModal( timeBlock : Client[] ) {
    this.currentTimeBlockToRemove = timeBlock;
    this.toggleShowCancelTimeBlockModal.emit('show');
    console.log("timblock trigger working");
    
  }

  showConfirmIndivCancelModal( client : Client ) {
    this.toggleShowCancelIndivModal.emit('show');
    this.currentClientToRemove = client;
  }

  showConfirmDoneApptModal( client : Client ) {
    this.toggleConfirmDoneApptModal.emit('show');
    this.currentClientToRemove = client;
  }

  showContactInfoModal( client : Client ) {
    this.toggleShowInfoModal.emit('show');
    this.currentClientToCheckInfo = client;
  }

  nextDate() { 
    this.currentDateIndex += this.currentDateIndex < this.distinctDates.length -1 ? 1 : 0;
    console.log( this.currentDateIndex );
    
    if( this.currentDateIndex == this.distinctDates.length - 1 ) {
      this.leftDisabled = false;
      this.rightDisabled = true;
    }
    else {
      this.leftDisabled = false;
      this.rightDisabled = false;
    }
    this.updateView();
  }

  previousDate() {
    this.currentDateIndex -= this.currentDateIndex > 0 ? 1 : 0;
    console.log( this.currentDateIndex );
    
    if( this.currentDateIndex == 0 ) {
      this.leftDisabled = true;
      this.rightDisabled = false;
    } else {
      this.leftDisabled = false;
      this.rightDisabled = false;
    }
    this.updateView();
  }

  refresh() {
    this.allClients = [];
    this.fetchClients();
    this.currentDateIndex = 0;
    this.leftDisabled = true;
    this.rightDisabled = false;
    this.updateView();
  }
}
