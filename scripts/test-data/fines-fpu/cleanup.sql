-- Removes only this script's synthetic, unlinked fixtures, regardless of current status/source.
\set ON_ERROR_STOP on

BEGIN;
SELECT pg_advisory_xact_lock(10324, 1);

DELETE FROM public.draft_accounts
WHERE submitted_by IN ('PO10324_FPU_A', 'PO10324_FPU_B')
  AND account ->> '_local_seed' = 'PO-10324:FPU-ToPublish:v1'
  AND account_id IS NULL
  AND account_number IS NULL;

COMMIT;
