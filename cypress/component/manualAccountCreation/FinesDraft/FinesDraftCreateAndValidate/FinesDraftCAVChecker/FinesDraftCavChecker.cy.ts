import { mount } from 'cypress/angular';
import { FinesDraftCavCheckerComponent } from 'src/app/flows/fines/fines-draft/fines-draft-cav/fines-draft-cav-checker/fines-draft-cav-checker.component';

describe('FinesDraftCavCheckerComponent', () => {
  const setupComponent = () => {
    mount(FinesDraftCavCheckerComponent, {
      providers: [],
      componentProperties: {},
    });
  };

  it('should render component', () => {
    setupComponent();
  });
});
