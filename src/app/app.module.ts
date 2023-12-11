import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

import { GovukHeaderComponent, GovukFooterComponent } from '@components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, GovukHeaderComponent, GovukFooterComponent, BrowserAnimationsModule],
  providers: [provideHttpClient(withFetch())],
  // providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
