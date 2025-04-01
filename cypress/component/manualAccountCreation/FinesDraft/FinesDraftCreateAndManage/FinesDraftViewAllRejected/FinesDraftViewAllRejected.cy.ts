import { mount } from 'cypress/angular';
import { FinesDraftViewAllRejectedComponent } from 'src/app/flows/fines/fines-draft/fines-draft-check-and-manage/fines-draft-view-all-rejected/fines-draft-view-all-rejected.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';

describe('FinesDraftViewAllRejectedComponent', () => {
  const setupComponent = () => {
    mount(FinesDraftViewAllRejectedComponent, {
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
