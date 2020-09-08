import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WeekScheduleComponent } from './week-schedule/week-schedule.component';

@NgModule({
  declarations: [
    AppComponent,
    WeekScheduleComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
