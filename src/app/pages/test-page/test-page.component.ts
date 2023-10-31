import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GovukAccordionComponent, GovukButtonComponent } from '@components/index';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent, GovukAccordionComponent],
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
})
export class TestPageComponent {}
