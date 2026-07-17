import { IOpalFinesReportParameters } from './opal-fines-report-parameters.interface';
import { TOpalFinesSupportedFileType } from '../types/opal-fines-supported-file-type.type';

export interface IOpalFinesReport {
  report_id: string;
  report_title: string;
  report_group: string;
  supported_file_types: TOpalFinesSupportedFileType[];
  audited_report: boolean;
  report_parameters?: IOpalFinesReportParameters;
  supports_multiple_business_units: boolean;
  is_bespoke_journey: boolean;
  shown_as_worklist: boolean;
  retention_period?: string;
  permission?: string | null;
  can_manually_create: boolean;
}
