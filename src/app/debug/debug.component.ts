import { Component, OnInit } from '@angular/core';
import { iif, NEVER, Observable, of } from 'rxjs';
import { map, merge, mergeMap } from "rxjs/operators";
import { HttpAppService } from '../utils/http.app.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css',
              '../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class DebugComponent implements OnInit {

  isSent : boolean = false;
  constructor( private httpService : HttpAppService ) { }

  ngOnInit(): void {
  }

  testMap() {
    const test = of(true);
    test.pipe(
      mergeMap((condition:boolean) => iif(() => condition === true ,
        this.httpService.getOpenDates().pipe(
          mergeMap((clientData) => {
            console.log(`client Data: ${clientData}`);
            return this.httpService.getOpenDates();
          })
        ), of('cancelled') ))
    ).subscribe((clientData)=>{
      if( clientData == 'cancelled' )
        console.log('ay nooo');
      else 
        console.log(clientData);
    });
  }
}
