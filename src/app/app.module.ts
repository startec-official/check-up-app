import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormArray } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { Routes , RouterModule, Router } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppComponent } from './app.component';
import { WeekScheduleComponent } from './week-schedule/week-schedule.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UnavaiablePageComponent } from './unavaiable-page/unavaiable-page.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DebugComponent } from './debug/debug.component';
import { ModModalComponent } from './mod-modal/mod-modal.component';
import { ModalHeaderDirective } from './modal-header.directive';
import { ModalBodyDirective } from './modal-body.directive';
import { ModalFooterDirective } from './modal-footer.directive';

const appRoutes : Routes = [
  { path : '' , component : HomeComponent },
  { path : 'schedule' , component : WeekScheduleComponent },
  { path : 'dashboard' , component : DashboardComponent },
  { path : 'unavailable' , component : UnavaiablePageComponent },
  { path : 'debug' , component : DebugComponent },
  { path : '**' , component : PageNotFoundComponent }
 ];

@NgModule({
  declarations: [
    AppComponent,
    WeekScheduleComponent,
    DashboardComponent,
    UnavaiablePageComponent,
    HomeComponent,
    DebugComponent,
    ModModalComponent,
    ModalHeaderDirective,
    ModalBodyDirective,
    ModalFooterDirective,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
