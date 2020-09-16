import { Component, NgZone, OnInit } from '@angular/core';
import { faBan , faEnvelope , faIdCard , faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { first, map } from "rxjs/operators";
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
  faChevron : any;

  clients : Client[] = [];

  dashboardViewArray = [];
  today : string;

  modal : Modal;

  isDoneLoading : boolean = false;

  constructor( private utils : UtilsService , private httpAppService : HttpAppService , private ngZone : NgZone ) { }

  ngOnInit(): void {
    
    this.today = this.getCurrentDate();
    this.fetchClients();
    this.modal = new Modal( false , '' , '' , '' , null );
    this.setIcons();
  }
  
  setIcons() {
    this.faBan = faBan;
    this.faEnvelope = faEnvelope;
    this.faIdCard = faIdCard;
    this.faCheck = faCheck;
    this.faChevron = faChevronDown;
  }

  fetchClients() {
    this.isDoneLoading = false;
    this.httpAppService.getData().pipe(map( data => {
      let clientsList = [];
      for ( let key in data ) {
        clientsList.push( data[key] );
      }
      return clientsList;
      })).subscribe( ( clientList ) => {

        clientList.forEach( (clientEl) => {
          this.clients.push( new Client(
            clientEl.client_id,
            clientEl.client_name,
            this.utils.getDateFromAmericanString(clientEl.client_day),
            clientEl.client_time,
            parseInt(clientEl.client_order),
            clientEl.client_number,
            clientEl.client_reason
          ));
        });
        this.clients.sort( (a,b) => {return a.userId - b.userId} );
        this.dashboardViewArray = this.getClientDateTime( this.today );
        this.isDoneLoading = true;
      });
  }

  getCurrentDate() {
    return this.utils.getCurrentDayString();
  }

  getClientDateTime( date : string ) {
    const today = date;
    const distincTimes = [ ... new Set(this.clients.map( x => x.time ))]; // Set only takes unique values
    const todayClients = this.clients.filter( client => client.date === today );
    let timesToday = [];
    distincTimes.forEach( time => {
      timesToday.push( todayClients.filter( client => client.time === time ));
    });
    timesToday = timesToday.filter( time => time.length > 0 ).sort(
      (first , second) => {
        const firstTime : number = parseInt(first[0].time.split(':')[0]);
        const secondTime : number = parseInt(second[0].time.split(':')[0]);
        return firstTime - secondTime;
    });
    return timesToday;
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
    this.httpAppService.removeEntry( client.userId ).subscribe(
      (data) => {
        const index : number = this.clients.indexOf(client, 0);
        if (index > -1) {
          this.clients.splice(index, 1)
        }
        console.log( this.clients );
        console.log( data );
        
        this.dashboardViewArray = this.getClientDateTime( this.today );
        this.isDoneLoading = true;
        console.log( data );
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
