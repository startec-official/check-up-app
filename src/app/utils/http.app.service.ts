import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpAppService {

  constructor( private http : HttpClient ) { }

  public postData( data : any , callback? : Function ) {
    this.http.post('http://localhost:3000/save',JSON.stringify( data ),{
      headers: { 'Content-Type' : 'application/json' }
    }).subscribe((data) => {
      console.log(`The request was executed with the ffg response: ${data}`);
     });
     try {
      callback();
    } catch( err ) {
      console.log( 'no function passed as callback' );
    }
  }
}
