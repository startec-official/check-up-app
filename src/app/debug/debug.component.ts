import { Component, OnInit } from '@angular/core';
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

  testWrite() {
    this.httpService.testWrite( {number : '+639663761426' , message : 'Hi! This is to inform you that you are awesome!'} ).subscribe( (data) => {
      console.log(data);
      this.isSent = true;
    });
  }
}
