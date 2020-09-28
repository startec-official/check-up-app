import { Component, NgZone, OnInit } from '@angular/core';
import { faBan , faEnvelope , faIdCard , faCheck , faChevronLeft , faChevronRight , faSync } from "@fortawesome/free-solid-svg-icons";
import * as moment from 'moment';
import { Moment } from 'moment';
import { map } from "rxjs/operators";
import { Client } from '../utils/client';
import { HttpAppService } from '../utils/http.app.service';
import { Modal } from '../utils/modal/modal.model';
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

  allClients : Client[] = [];
  distinctTimesForClientsOfDay = [];
  distinctDates : Moment[] = [];

  modal : Modal;
  leftDisabled : boolean = true;
  rightDisabled : boolean = false;
  currentDateIndex :number = 0;

  isDoneLoading : boolean = false;

  constructor( private utils : UtilsService , private httpAppService : HttpAppService , private ngZone : NgZone ) { }

  ngOnInit(): void {
    
    this.fetchClients();
    this.rightDisabled = this.distinctDates.length > 1;
    this.currentDateIndex = 0;
    this.modal = new Modal( false , '' , '' , '' , null );
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
        this.updateView();
        this.isDoneLoading = true;
      });
  }

  updateView() {
    this.distinctTimesForClientsOfDay = this.getClientsForDateSepByTime( this.distinctDates[ this.currentDateIndex ] );
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
    this.updateView();
  }

  triggerAppCompVerification( client : Client ) {
    this.modal.setModal( true , 'confirm' , 'Confirm Complete' , 'Are you sure your appointment is done?' , client );
  }

  triggerContactInfoMessage(   client : Client ) {
      this.modal.setModal( true, 'info' , 'Contact info' , 'Dial the following number: ' , client.contactNumber );
  }

  modalConfirm( event ) { // TODO: delete entry from DB once this is done
    const client = <Client> event;
    this.isDoneLoading = false; // TODO: fix issue of process not completed
    this.httpAppService.removeClient( client.userId ).subscribe(
      (data) => {
        const index : number = this.allClients.indexOf(client, 0);
        if (index > -1) {
          this.allClients.splice(index, 1)
        }
        this.updateView();
        this.isDoneLoading = true;
      }
    );
  }

  hideModal() {
    this.modal.showMessage = false;
  }

  // testAdd() { // TODO: remove test add once done
  //   this.clients.push( new Client( 5 , 'hello' , this.utils.getDateFromAmericanString('09/16/2020') , '5:00-17:00' , 1 , '09663761426' , "ham" ) );
  //   this.dashboardViewArray = this.getClientDateTime( this.today );
  //   console.log( this.clients );
  // }
}
