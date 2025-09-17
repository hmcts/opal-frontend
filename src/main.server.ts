import { bootstrapApplication } from '@angular/platform-browser';
import { ApplicationRef } from '@angular/core';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

export function render(context: any): Promise<ApplicationRef> {
  return bootstrapApplication(
    AppComponent,
    {
      ...config,
      providers: config.providers || [],
    },
    context,
  );
}

export default render;
