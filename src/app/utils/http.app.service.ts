import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpAppService {

  constructor( private http : HttpClient ) { }

  postData( data : any ) {
    return this.http.post('http://localhost:3000/save',JSON.stringify( data ),{
      headers: { 'Content-Type' : 'application/json' }
    });
  }

  public getData() {
    return this.http.get( `http://localhost:3000/display/`, { 
      headers: { 'Content-Type' : 'application/json' } 
    });
  }

  public getOutDays() {
    return this.http.get( `http://localhost:3000/display/schedules` , {
      headers: { 'Content-Type' : 'application/json' }
    });
  }

  public removeEntry( userId : number ) { // TODO: figure out defect in delete method
   return this.http.get( `http://localhost:3000/remove/${userId}`); 
  }
}
