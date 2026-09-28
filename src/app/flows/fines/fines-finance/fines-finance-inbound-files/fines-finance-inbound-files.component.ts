import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { InterfaceFileViewerFileSource, InterfaceFileViewerFileType} from '../constants/fines-finance-enums.constant';

@Component({
  selector: 'app-fines-ext-finance-inbound-files',
  imports: [],
  templateUrl: './fines-finance-inbound-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFinanceInboundFilesComponent {



public readonly fileTypeAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] =
  Object.values(InterfaceFileViewerFileType).map((fileType) => ({
    name: fileType,
    value: fileType,
  })
);

public readonly fileSourceAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] =
  Object.values(InterfaceFileViewerFileSource).map((fileSource) => ({
    name: fileSource,
    value: fileSource,
  })
);

public ngOnInit(): void {
   

  }

}
