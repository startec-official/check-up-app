import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from "rxjs/operators";
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
    const test = of(1);
    test.pipe(
      mergeMap(() => {
        console.log('uno');
        return this.httpService.getOpenDates();
      }),
      mergeMap((scheduleData) => {
        console.log('dos');
        console.log(scheduleData);
        return this.httpService.getClientData()
      })
    ).subscribe((clientData)=>{
      console.log('treees');
      console.log(clientData);
    });
  }
}
