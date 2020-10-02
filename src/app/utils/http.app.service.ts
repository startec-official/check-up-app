import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { text } from '@fortawesome/fontawesome-svg-core';
import { Moment } from 'moment';
import { Client } from './client';

@Injectable({
  providedIn: 'root'
})
export class HttpAppService {

  constructor( private http : HttpClient ) { }

  public postScheduleData( data : any ) {
    return this.http.post('http://localhost:3000/schedule/overwriteSaveTo',JSON.stringify( data ),{
      headers: { 'Content-Type' : 'application/json' },
      responseType : 'text'
    });
  }

  public postSchedClientsData( data : Client[] , newDate : Moment , newTime : string ) {
    return this.http.post( `http://localhost:3000/clients/transfer/${newDate}/${newTime}` , JSON.stringify(data), {
      headers : { 'Content-Type' : 'application/json' },
      responseType : 'text'
    });
  }

  public getClientData() {
    return this.http.get( `http://localhost:3000/clients/displayAll`, { 
      headers: { 'Content-Type' : 'application/json' } 
    });
  }

  public getOutDays() {
    return this.http.get( `http://localhost:3000/schedule/select/out` , {
      headers: { 'Content-Type' : 'application/json' }
    });
  }

  public getOpenDates() {
    return this.http.get( 'http://localhost:3000/schedule/select/open' , {
      headers : { 'Content-Type' : 'application/json' }
    });
  }

  public removeClient( userIdsString : string ) {
   return this.http.delete( `http://localhost:3000/clients/remove/${userIdsString}`,{
     responseType : 'text'
   });
  }

  public removeReschedClient( usersIds : number[] ) { // TODO: set parse to accessor
    var stringURL = `http://localhost:3000/clients/resched/remove/`;
    usersIds.forEach( ( id : number ) => {
      stringURL += `${id},`;
    });
    stringURL = stringURL.slice( 0 , stringURL.length - 1); // remove last comma
    return this.http.delete( stringURL , { 
      responseType : 'text'
     });
  }

  public updateSchedSlot( date : Moment , time : string , increment : number ) {
    // MMMM Do YYYY, dddd
    return this.http.post( `http://localhost:3000/schedule/changeslot/${date.format()}/${time}/${ increment }` , null , {
      headers : { 'Content-Type' : 'application/json' },
      responseType : 'text'
    });
  }

  public postReschedClientsData( data : Client[] ) {
    return this.http.post( 'http://localhost:3000/clients/resched/transfer' , JSON.stringify(data), {
      headers : { 'Content-Type' : 'application/json' },
      responseType : 'text'
    });
  }

  public testWrite( data : any ) {
    return this.http.post( 'http://localhost:3000/clients/testWrite' , JSON.stringify( data ) , {
      headers: { 'Content-Type' : 'application/json' },
      responseType: 'text'
    } );
  }

  public getReschedClientData() {
    return this.http.get( 'http://localhost:3000/schedule/getresched' , {
      headers : { 'Content-Type' : 'application/json' }
    });
  }
}
