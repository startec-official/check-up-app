import { HttpClient } from '@angular/common/http';
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
    return this.http.get( 'http://localhost:3000/display', { 
      headers: { 'Content-Type' : 'application/json' } 
    });
  }
}
