import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  public removeClient( userId : number ) { // TODO: figure out defect in delete method
   return this.http.delete( `http://localhost:3000/clients/remove/${userId}`,{
     responseType : 'text'
   }); 
  }

  public testWrite( data : any ) {
    return this.http.post( 'http://localhost:3000/clients/testWrite' , JSON.stringify( data ) , {
      headers: { 'Content-Type' : 'application/json' },
      responseType: 'text'
    } );
  }
}
