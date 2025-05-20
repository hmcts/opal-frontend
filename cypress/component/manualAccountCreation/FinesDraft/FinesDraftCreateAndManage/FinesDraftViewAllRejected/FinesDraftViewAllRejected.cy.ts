import { mount } from 'cypress/angular';
import { FinesDraftCreateAndManageViewAllRejectedComponent } from 'src/app/flows/fines/fines-draft/fines-draft-create-and-manage/fines-draft-create-and-manage-view-all-rejected/fines-draft-create-and-manage-view-all-rejected.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';

describe('FinesDraftCreateAndManageViewAllRejectedComponent', () => {
  const setupComponent = () => {
    mount(FinesDraftCreateAndManageViewAllRejectedComponent, {
      providers: [
        FinesDraftStore,
        Router,
        {
          provide: ActivatedRoute,
          useValue: {
            parent: { snapshot: { url: ['create-and-manage'] } },
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
