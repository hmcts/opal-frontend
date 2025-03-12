import { mount } from 'cypress/angular';
import { FinesDraftCamViewAllRejectedComponent } from 'src/app/flows/fines/fines-draft/fines-draft-cam/fines-draft-cam-view-all-rejected/fines-draft-cam-view-all-rejected.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';

describe('FinesDraftCamViewAllRejectedComponent', () => {
  const setupComponent = () => {
    mount(FinesDraftCamViewAllRejectedComponent, {
      providers: [
        FinesDraftStore,
        Router,
        {
          provide: ActivatedRoute,
          useValue: {
            parent: { snapshot: { url: ['check-and-manage'] } },
          },
        },
      ],

      componentProperties: {},
    });
  };

  it('should render component', () => {
    setupComponent();
  });
});
