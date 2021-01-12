import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { Client } from './client';

@Injectable({
  providedIn: 'root'
})
export class HttpAppService {

  localhost : string = "localhost"; // TODO: change for dev env

  constructor( private http : HttpClient ) { }

  public postScheduleData( data : any ) {
    return this.http.post(`http://${this.localhost}:3000/schedule/overwriteSaveTo`,JSON.stringify( data ),{
      headers: { 'Content-Type' : 'application/json' },
      responseType : 'text'
    });
  }

  public postSchedClientsData( data : Client[] , newDate : Moment , newTime : string ) {
    return this.http.post( `http://${this.localhost}:3000/clients/transfer/${newDate}/${newTime}` , JSON.stringify(data), {
      headers : { 'Content-Type' : 'application/json' },
      responseType : 'text'
    });
  }

  public getClientData() {
    return this.http.get( `http://${this.localhost}:3000/clients/display/all`, { 
      headers: { 'Content-Type' : 'application/json' } 
    });
  }

  public getClientContactPairs( currentDate : string ) {
     return this.http.get(`http://${this.localhost}:3000/clients/display/contactpairs/${currentDate}` , {
       headers : { 'Content-Type' : 'application/json' }
     });
  }

  public getOutDays() {
    return this.http.get( `http://${this.localhost}:3000/schedule/select/out` , {
      headers: { 'Content-Type' : 'application/json' }
    });
  }

  public getOpenDates() {
    return this.http.get( `http://${this.localhost}:3000/schedule/select/open` , {
      headers : { 'Content-Type' : 'application/json' }
    });
  }

  public removeClient( userIdsString : string ) {
   return this.http.delete( `http://${this.localhost}:3000/clients/remove/${userIdsString}`,{
     responseType : 'text'
   });
  }

  public removeReschedClient( usersIds : number[] ) { // TODO: set parse to accessor
    var stringURL = `http://${this.localhost}:3000/clients/resched/remove/`;
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
    console.log(`date: ${date}, time: ${time}, increment: ${increment}`);
    return this.http.post( `http://${this.localhost}:3000/schedule/changeslot/${date.format()}/${time}/${ increment }` , null , {
      headers : { 'Content-Type' : 'application/json' },
      responseType : 'text'
    });
  }

  public updateSchedSlotsForDate( date : string ) {
    return this.http.post( `http://${this.localhost}:3000/schedule/fillslot/${date}` , null , {
      headers : { 'Content-Type' : 'application/json' },
      responseType : 'text'
    });
  }

  public postReschedClientsData( data : Client[] ) {
    return this.http.post( `http://${this.localhost}:3000/clients/resched/transfer` , JSON.stringify(data), {
      headers : { 'Content-Type' : 'application/json' },
      responseType : 'text'
    });
  }

  public getReschedClientData() {
    return this.http.get( `http://${this.localhost}:3000/schedule/getresched` , {
      headers : { 'Content-Type' : 'application/json' }
    });
  }

  public sendCustomMessage( message : string , contactNos : string[] ) {
    var contactsString : string = "";
    contactNos.forEach( (contactNo) => {
      contactsString += `${contactNo},`;
    });
    contactsString = contactsString.substring(0,contactsString.length-1);
    return this.http.post(`http://${this.localhost}:3000/clients/sendmessage/custom/${contactsString}`,JSON.stringify({ customMessage : message}),{
      headers : { 'Content-Type' : 'application/json' },
      responseType : 'text'
    });
  }

  public sendReschedMessage( inputDate : Moment , inputTime : string , inputContacts : string[] , inputCodes : string[] ) {
    const dataBody = { date : inputDate.format('MM/DD/YY') , time : inputTime , codes : inputCodes  };
    var contactsString : string = "";
    inputContacts.forEach( (contactNo) => {
      contactsString += `${contactNo},`;
    });
    contactsString = contactsString.substring(0,contactsString.length-1);
    return this.http.post(`http://${this.localhost}:3000/clients/sendmessage/reschedule/complete/${contactsString}`,dataBody,{
      headers : { 'Content-Type' : 'application/json' },
      responseType : 'text'
    });
  }

  public sendMovedToReschedMessage( contactNos : string[] ) {
    var contactsString : string = "";
    contactNos.forEach( (contactNo) => {
      contactsString += `${contactNo},`;
    });
    contactsString = contactsString.substring(0,contactsString.length-1);
    return this.http.post(`http://${this.localhost}:3000/clients/sendmessage/reschedule/moved/${contactsString}`, null ,{
      headers : { 'Content-Type' : 'application/json' },
      responseType : 'text'
    });
  }

  public sendCancelledMessage( contactNos : string[] ) {
    var contactsString : string = "";
    contactNos.forEach( (contactNo) => {
      contactsString += `${contactNo},`;
    });
    contactsString = contactsString.substring(0,contactsString.length-1);
    return this.http.post( `http://${this.localhost}:3000/clients/sendmessage/reschedule/cancel/${contactsString}` , null , {
      headers : { 'Content-Type' : 'application/json' },
      responseType : 'text'
    });
  }

  //debug
  public testWrite( data : any ) {
    return this.http.post( `http://${this.localhost}:3000/clients/test` , JSON.stringify( data ) , {
      headers: { 'Content-Type' : 'application/json' },
      responseType: 'text'
    } );
  }
}
