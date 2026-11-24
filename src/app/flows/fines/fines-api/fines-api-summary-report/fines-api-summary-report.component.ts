import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_API_ROUTING_PATHS } from '../routing/constants/fines-api-routing-paths.constant';
import { IFinesApiSummaryReport } from './interfaces/fines-api-summary-report.interface';

/** Read-only processing report shared by the Till and File routes. */
@Component({
  selector: 'app-fines-api-summary-report',
  imports: [RouterLink],
  templateUrl: './fines-api-summary-report.component.html',
  styleUrl: './fines-api-summary-report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiSummaryReportComponent {
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);
  protected readonly report = toSignal(this.route.data.pipe(map((data) => data['report'] as IFinesApiSummaryReport)));
  protected readonly backRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_API_ROUTING_PATHS.root,
    FINES_API_ROUTING_PATHS.children.processAllocate,
  ];

  /** Opens the browser's native print dialogue only on user activation. */
  protected print(): void {
    this.document.defaultView?.print();
  }
}
