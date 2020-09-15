import { Component, OnInit } from '@angular/core';
import { faBan , faEnvelope , faIdCard , faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { map } from "rxjs/operators";
import { Client } from '../utils/client';
import { HttpAppService } from '../utils/http.app.service';
import { UtilsService } from '../utils/utils.service';
import { Modal } from '../utils/modal/modal.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css',
              '../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class DashboardComponent implements OnInit {

  faBan : any;
  faEnvelope : any;
  faCheck : any;
  faIdCard : any;
  faChevron : any;

  clients : Client[] = [];

  timesToday = [];
  today : string;

  modal : Modal;

  isDoneLoading : boolean = false;

  constructor( private utils : UtilsService , private httpAppService : HttpAppService ) { }

  ngOnInit(): void {
    this.faBan = faBan;
    this.faEnvelope = faEnvelope;
    this.faIdCard = faIdCard;
    this.faCheck = faCheck;
    this.faChevron = faChevronDown;

    this.httpAppService.getData().pipe(map( data => {
      let clientsList = [];
      for ( let key in data ) {
        clientsList.push( data[key] );
      }
      return clientsList;
    })).subscribe( (clientsList) => {
        clientsList.forEach( clientEl => {
          this.clients.push( new Client(
          clientEl.client_name,
          this.utils.getDateFromAmericanString(clientEl.client_day),
          clientEl.client_time,
          parseInt(clientEl.client_order),
          clientEl.client_number,
          clientEl.client_reason
        ));
      });
      this.today = this.getCurrentDate();
      this.timesToday = this.getClientDateTime( this.today );
      this.isDoneLoading = true;
    });

    this.modal = new Modal( false , '' , '' , '' , null );
  }

  getCurrentDate() {
    return this.utils.getCurrentDayString();
  }

  getClientDateTime( date : string ) { // TODO: transfer to client class as static function
    const today = date;
    const distincTimes = [ ... new Set(this.clients.map( x => x.time ))];
    const todayClients = this.clients.filter( client => client.date === today );
    let timesToday = [];
    distincTimes.forEach( time => {
      timesToday.push( todayClients.filter( client => client.time === time ));
    });
    return timesToday.filter( time => time.length > 0 );
  }

  // TODO: set server ASYNC functionality

  triggerAppCompVerification( client : Client ) {
      this.modal.showMessage = true;
      this.modal.inputData = client;
      this.modal.modalType = 'confirm';
      this.modal.headerMessage = 'Confirm Complete';
      this.modal.bodyMessage = 'Are you sure your appointment is done?';
  }

  triggerContactInfoMessage( client : Client ) {
      this.modal.showMessage = true;
      this.modal.inputData = client.contactNumber;
      this.modal.modalType = 'info';
      this.modal.headerMessage = 'Contact Info';
      this.modal.bodyMessage = 'Dial the following number: ';
  }

  modalConfirm( event ) { // TODO: delete entry from DB once this is done
  }

  hideModal() {
    this.modal.showMessage = false;
  }
}
