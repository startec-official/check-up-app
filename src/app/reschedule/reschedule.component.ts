import { Component, EventEmitter, OnInit } from '@angular/core';
import { faBan , faEnvelope , faCheckDouble , faArrowRight, faPaperPlane, faAddressBook } from "@fortawesome/free-solid-svg-icons";
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

  currentSelectedClientIds : number[] = [];
  currentInfoClient : Client;

  faEnvelope : any;
  faBan : any;
  faChevronLeft : any;
  faCheckDouble : any;
  paperPlane : any;
  phoneBook : any;

  toggleBatchCancelModal : EventEmitter<string>;
  toggleBatchRescheduleModal : EventEmitter<string>;
  toggleLoadingModal : EventEmitter<string>;
  toggleDateSelectModal : EventEmitter<string>;
  toggleBatchMessageModal : EventEmitter<string>;
  toggleMessageModal : EventEmitter<string>;
  toggleShowInfoModal : EventEmitter<string>;

  textMessageString : string = "";

  isDoneLoading : boolean = false;

  constructor( private utils : UtilsService,
               private  httpService : HttpAppService ) { }

  ngOnInit(): void {
    // this.reschedClients.push( new Client( 1 , 'ELISE  REYES' , this.utils.getCurrentDate() , '7:00-17:00' , 1 , '+639663761436' , 'coughs' ) );
    // this.reschedClients.push( new Client( 1 , 'LAILA GARCIA' , this.utils.getCurrentDate() , '7:00-17:00' , 1 , '+639663761436' , 'coughs' ) );
    // this.reschedClients.push( new Client( 1 , 'FRANCOIS DUPONT' , this.utils.getCurrentDate() , '7:00-17:00' , 1 , '+639663761436' , 'coughs' ) );

    this.fetchClients();

    for( var  i = 0 ; i < this.reschedClients.length ; i ++ ) { // initialize selected rows index array
      this.rowSelected[i] = false;
    }

    this.faEnvelope = faEnvelope;
    this.faBan = faBan;
    this.faChevronLeft = faArrowRight;
    this.faCheckDouble = faCheckDouble;
    this.paperPlane = faPaperPlane;
    this.phoneBook = faAddressBook;

    this.toggleBatchCancelModal = new EventEmitter();
    this.toggleBatchRescheduleModal = new EventEmitter();
    this.toggleLoadingModal = new EventEmitter();
    this.toggleDateSelectModal = new EventEmitter();
    this.toggleMessageModal = new EventEmitter();
    this.toggleBatchMessageModal = new EventEmitter();
    this.toggleShowInfoModal = new EventEmitter();
    
    this.currentInfoClient = new Client(-1,'',moment(),'',1,'','');
  }

  fetchClients() {
    this.isDoneLoading = false;
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
        this.reschedClients.sort( (a,b) => {return a.userId - b.userId} );
        this.isDoneLoading = true;
      });
  }
 
  selectRow( rowIdx : number ) {
    this.rowSelected[rowIdx] = !this.rowSelected[rowIdx];
  }

  setAllSelected() {
    for( var i = 0 ; i < this.rowSelected.length ; i ++ ) {
      this.rowSelected[i] = true;
    }
  }

  showBatchCancelModal() {
    this.toggleBatchCancelModal.emit('show');
    this.currentSelectedClientIds = this.getSelectedClients();
    console.log( this.currentSelectedClientIds );
    
  }

  getSelectedClients() : number[] {
    var selectedClients : number[] = [];
    for( var i = 0 ; i < this.rowSelected.length ; i ++ ) {
      if( this.rowSelected[i] ) {
        selectedClients.push( this.reschedClients[ i ].userId );
      }
    }
    return selectedClients;
  }

  showBatchRescheduleModal() {
    this.toggleBatchRescheduleModal.emit('show');
  }

  showDateSelectModal() {
    this.toggleDateSelectModal.emit('show');
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

  onBatchRescheduleConfirmed() {
    this.toggleLoadingModal.emit('show');
    setTimeout( () => { // replace with actual code
      this.toggleLoadingModal.emit('hide');
    } , 5000 );
  }

  onBatchCancelConfirmed() {
    this.toggleLoadingModal.emit('show');
    this.currentSelectedClientIds = this.getSelectedClients();
    this.httpService.removeReschedClient( this.currentSelectedClientIds ).subscribe((data) => {
      console.log(data);
      this.toggleLoadingModal.emit('hide');
    });
  }

  onMessageConfirmed() {
    this.toggleLoadingModal.emit('show');
    setTimeout( () => { // replace with actual code
      this.toggleLoadingModal.emit('hide');
    } , 5000 );
  }

  get selectRowCount() : number {
    return this.rowSelected.filter((val)=>val===true).length;
  }

  get allRowCount() : number {
    return this.rowSelected.length;
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
}
