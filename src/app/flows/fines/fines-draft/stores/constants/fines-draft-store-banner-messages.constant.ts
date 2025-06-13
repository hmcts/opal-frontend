import { FinesDraftBannerType } from '../types/fines-draft-banner.type';

export const FINES_DRAFT_BANNER_MESSAGES: Record<FinesDraftBannerType, (name?: string) => string> = {
  submitted: (name?: string) => `You have submitted ${name}'s account for review.`,
  deleted: (name?: string) => `You have deleted ${name}'s account.`,
  rejected: (name?: string) => `You have rejected ${name}'s account.`,
  approved: (name?: string) => `You have approved ${name}'s account.`,
  error: () => `There was a problem publishing this account. Please contact your line manager.`,
};
