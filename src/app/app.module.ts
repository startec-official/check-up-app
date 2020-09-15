import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormArray } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppComponent } from './app.component';
import { WeekScheduleComponent } from './week-schedule/week-schedule.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModalComponent } from './utils/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    WeekScheduleComponent,
    DashboardComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
