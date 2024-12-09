import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ClientComponent } from './components/client/client.component';
import { ConfClientComponent } from './components/conf-client/conf-client.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { ConfigurationClientComponent } from './components/configuration-client/configuration-client.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { HistoriqueLogsComponent } from './components/historique-logs/historique-logs.component';
import { HomeComponent } from './components/home/home.component';
import { InformationDetaillesComponent } from './components/information-detailles/information-detailles.component';
import { InformationTotalComponent } from './components/information-total/information-total.component';
import { LoginComponent } from './components/login/login.component';
import { RoleComponent } from './components/role/role.component';
import { FrenchDatepickerIntlComponent } from './components/french-datepicker-intl/french-datepicker-intl.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    ClientComponent,
    ConfClientComponent,
    ConfigurationComponent,
    ConfigurationClientComponent,
    ConfirmDialogComponent,
    HistoriqueLogsComponent,
    HomeComponent,
    InformationDetaillesComponent,
    InformationTotalComponent,
    LoginComponent,
    RoleComponent,
    FrenchDatepickerIntlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
