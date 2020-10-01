import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { text } from '@fortawesome/fontawesome-svg-core';

@Injectable({
  providedIn: 'root'
})
export class HttpAppService {

  constructor( private http : HttpClient ) { }

  postScheduleData( data : any ) {
    return this.http.post('http://localhost:3000/schedule/overwriteSaveTo',JSON.stringify( data ),{
      headers: { 'Content-Type' : 'application/json' },
      responseType : 'text'
    });
  }

  public getClientData() {
    return this.http.get( `http://localhost:3000/clients/displayAll`, { 
      headers: { 'Content-Type' : 'application/json' } 
    });
  }

  public getOutDays() {
    return this.http.get( `http://localhost:3000/schedule/selectDistinct` , {
      headers: { 'Content-Type' : 'application/json' }
    });
  }

  public removeClient( userIdsString : string ) { // TODO: figure out defect in delete method
   return this.http.delete( `http://localhost:3000/clients/remove/${userIdsString}`,{
     responseType : 'text'
   });
  }

  public removeReschedClient( usersIds : number[] ) {
    var stringURL = `http://localhost:3000/clients/resched/remove/`;
    usersIds.forEach( ( id : number ) => {
      stringURL += `${id},`;
    });
    stringURL = stringURL.slice( 0 , stringURL.length - 1); // remove last comma
    return this.http.delete( stringURL , { 
      responseType : 'text'
     });
  }

  public postReschedClientsData( data : any ) {
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
