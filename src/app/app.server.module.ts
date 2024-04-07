import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';

@NgModule({
  imports: [AppModule, ServerModule],
  bootstrap: [AppComponent],
  providers: [provideClientHydration(withNoHttpTransferCache())],
})
export class AppServerModule {}
