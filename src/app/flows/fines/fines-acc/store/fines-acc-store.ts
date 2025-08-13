import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

// Interface for add note form
export interface IFinesAccAddNoteForm {
  facc_add_notes: string;
}

// Interface for add comment form
export interface IFinesAccAddCommentForm {
  facc_add_comments: string;
}

// Interface for account details
export interface IFinesAccAccountDetails {
  account_number: string;
  account_name: string;
  defendant_name: string;
  account_type: string;
  business_unit: string;
  account_status: string;
  outstanding_balance: number;
  last_hearing_date?: string;
  court_name?: string;
  imposing_court?: string;
  payment_terms?: string;
  last_payment_date?: string;
  last_payment_amount?: number;
}



export const FinesAccStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    // Account details
    accountDetails: null as IFinesAccAccountDetails | null,

    // Add note form
    addNoteForm: {
      facc_add_notes: '',
    } as IFinesAccAddNoteForm,

    // Add comment form
    addCommentForm: {
      facc_add_comments: '',
    } as IFinesAccAddCommentForm,


    // General state tracking
    stateChanges: false,
    unsavedChanges: false,
  })),

  withComputed((store) => ({
    // Account details computed
    hasAccountDetails: computed(() => !!store.accountDetails()),
    accountNumber: computed(() => store.accountDetails()?.account_number || ''),
    accountName: computed(() => store.accountDetails()?.account_name || ''),
    defendantName: computed(() => store.accountDetails()?.defendant_name || ''),
    outstandingBalance: computed(() => store.accountDetails()?.outstanding_balance || 0),


    // Form validation
    isAddNoteFormValid: computed(
      () => !!store.addNoteForm().facc_add_notes && store.addNoteForm().facc_add_notes.trim().length > 0,
    ),
    isAddCommentFormValid: computed(
      () => !!store.addCommentForm().facc_add_comments && store.addCommentForm().facc_add_comments.trim().length > 0,
    ),
  })),

  withMethods((store, opalFinesService = inject(OpalFines)) => ({
    // Account details methods
    setAccountDetails: (accountDetails: IFinesAccAccountDetails) => {
      patchState(store, {
        accountDetails,
        stateChanges: true,
      });
    },

    fetchAccountDetails: async (accountId: string) => {
      try {
        patchState(store, {
        });

        // TODO: Replace with actual API call when method exists
        // const response = await opalFinesService.getAccountDetails(accountId).toPromise();

        // Mock response for now - replace with actual API call
        const response: IFinesAccAccountDetails = {
          account_number: accountId,
          account_name: 'Mock Account',
          defendant_name: 'Mock Defendant',
          account_type: 'Fine',
          business_unit: 'Mock Business Unit',
          account_status: 'Active',
          outstanding_balance: 1000.0,
        };

        patchState(store, {
          accountDetails: response,
          accountDetailsApi: { loading: false, error: null },
          stateChanges: false,
        });

        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch account details';
        patchState(store, {
          accountDetailsApi: { loading: false, error: errorMessage },
        });
        throw error;
      }
    },

    // Add note form methods
    setAddNoteForm: (formData: IFinesAccAddNoteForm) => {
      patchState(store, {
        addNoteForm: formData,
        stateChanges: true,
        unsavedChanges: true,
      });
    },

    updateAddNoteField: (notes: string) => {
      patchState(store, {
        addNoteForm: { facc_add_notes: notes },
        stateChanges: true,
        unsavedChanges: true,
      });
    },

    submitAddNote: async (accountId: string) => {
      try {
        patchState(store, {
          addNoteApi: { loading: true, error: null },
        });

        // TODO: Replace with actual API call when method exists
        // const response = await opalFinesService.postAccountNote(accountId, store.addNoteForm()).toPromise();

        // Mock successful response for now
        const response = { success: true, message: 'Note added successfully' };

        patchState(store, {
          addNoteApi: { loading: false, error: null },
          addNoteForm: { facc_add_notes: '' },
          stateChanges: false,
          unsavedChanges: false,
        });

        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add note';
        patchState(store, {
          addNoteApi: { loading: false, error: errorMessage },
        });
        throw error;
      }
    },

    // Add comment form methods
    setAddCommentForm: (formData: IFinesAccAddCommentForm) => {
      patchState(store, {
        addCommentForm: formData,
        stateChanges: true,
        unsavedChanges: true,
      });
    },

    updateAddCommentField: (comments: string) => {
      patchState(store, {
        addCommentForm: { facc_add_comments: comments },
        stateChanges: true,
        unsavedChanges: true,
      });
    },

    submitAddComment: async (accountId: string) => {
      try {
        patchState(store, {
          addCommentApi: { loading: true, error: null },
        });

        // TODO: Replace with actual API call when method exists
        // const response = await opalFinesService.postAccountComment(accountId, store.addCommentForm()).toPromise();

        // Mock successful response for now
        const response = { success: true, message: 'Comment added successfully' };

        patchState(store, {
          addCommentApi: { loading: false, error: null },
          addCommentForm: { facc_add_comments: '' },
          stateChanges: false,
          unsavedChanges: false,
        });

        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add comment';
        patchState(store, {
          addCommentApi: { loading: false, error: errorMessage },
        });
        throw error;
      }
    },

    // Error management
    clearAccountDetailsError: () => {
      patchState(store, {
        accountDetailsApi: { ...store.accountDetailsApi(), error: null },
      });
    },

    clearAddNoteError: () => {
      patchState(store, {
        addNoteApi: { ...store.addNoteApi(), error: null },
      });
    },

    clearAddCommentError: () => {
      patchState(store, {
        addCommentApi: { ...store.addCommentApi(), error: null },
      });
    },

    clearAllErrors: () => {
      patchState(store, {
        accountDetailsApi: { ...store.accountDetailsApi(), error: null },
        addNoteApi: { ...store.addNoteApi(), error: null },
        addCommentApi: { ...store.addCommentApi(), error: null },
      });
    },

    // State management
    resetAddNoteForms: () => {
      patchState(store, {
        addNoteForm: { facc_add_notes: '' },
        unsavedChanges: false,
      });
    },

    resetAddCommentForms: () => {
      patchState(store, {
        addCommentForm: { facc_add_comments: '' },
        unsavedChanges: false,
      });
    },

    resetAllForms: () => {
      patchState(store, {
        addNoteForm: { facc_add_notes: '' },
        addCommentForm: { facc_add_comments: '' },
        unsavedChanges: false,
      });
    },

    resetStore: () => {
      patchState(store, {
        accountDetails: null,
        addNoteForm: { facc_add_notes: '' },
        addCommentForm: { facc_add_comments: '' },
        accountDetailsApi: { loading: false, error: null },
        addNoteApi: { loading: false, error: null },
        addCommentApi: { loading: false, error: null },
        stateChanges: false,
        unsavedChanges: false,
      });
    },

    // Utility methods
    setUnsavedChanges: (unsavedChanges: boolean) => {
      patchState(store, { unsavedChanges });
    },

    setStateChanges: (stateChanges: boolean) => {
      patchState(store, { stateChanges });
    },
  })),
);
