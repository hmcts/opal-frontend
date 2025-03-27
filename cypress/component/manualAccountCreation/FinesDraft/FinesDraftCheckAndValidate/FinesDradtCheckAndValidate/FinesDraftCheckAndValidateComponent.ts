import { mount } from 'cypress/angular';
import { FinesDraftCheckAndValidateTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-check-and-validate/fines-draft-check-and-validate-tabs/fines-draft-check-and-validate-tabs.component';

describe('FinesDraftCavCheckerComponent', () => {
  const setupComponent = () => {
    mount(FinesDraftCheckAndValidateTabsComponent, {
      providers: [],
      componentProperties: {},
    });
  };

  it('should render component', () => {
    setupComponent();
  });
});
