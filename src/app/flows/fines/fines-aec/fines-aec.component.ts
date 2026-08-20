import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fines-aec',
  imports: [RouterOutlet],
  templateUrl: './fines-aec.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAecComponent {}
