-- PO-10324: synthetic draft accounts for the To publish summary only.
-- Usage: psql -X -v first_business_unit_id=77 -v second_business_unit_id=78 -f seed.sql
\set ON_ERROR_STOP on

\if :{?first_business_unit_id}
\else
DO $$ BEGIN RAISE EXCEPTION 'Set first_business_unit_id with psql -v.'; END $$;
\endif
\if :{?second_business_unit_id}
\else
DO $$ BEGIN RAISE EXCEPTION 'Set second_business_unit_id with psql -v.'; END $$;
\endif

BEGIN;
SET LOCAL TIME ZONE 'UTC';
SELECT pg_advisory_xact_lock(10324, 1);

CREATE TEMP TABLE fpu_seed_business_units (
    slot smallint PRIMARY KEY,
    business_unit_id smallint NOT NULL,
    ticket_count integer NOT NULL
) ON COMMIT DROP;

INSERT INTO fpu_seed_business_units (slot, business_unit_id, ticket_count)
VALUES (1, :'first_business_unit_id'::smallint, 7),
       (2, :'second_business_unit_id'::smallint, 5);

DO $$
BEGIN
    IF (SELECT count(DISTINCT business_unit_id) FROM fpu_seed_business_units) <> 2 THEN
        RAISE EXCEPTION 'Choose two different existing Business Unit IDs.';
    END IF;

    IF (SELECT count(*) FROM fpu_seed_business_units seed
        JOIN public.business_units bu USING (business_unit_id)) <> 2 THEN
        RAISE EXCEPTION 'Both Business Unit IDs must already exist in public.business_units.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.draft_accounts
        WHERE submitted_by IN ('PO10324_FPU_A', 'PO10324_FPU_B')
          AND account ->> '_local_seed' = 'PO-10324:FPU-ToPublish:v1'
          AND (account_id IS NOT NULL OR account_number IS NOT NULL)
    ) THEN
        RAISE EXCEPTION 'A previous FPU seed row has a linked account; use a fresh test database.';
    END IF;
END $$;

-- Reruns replace only this script's unlinked fixtures, including changed statuses/sources.
DELETE FROM public.draft_accounts
WHERE submitted_by IN ('PO10324_FPU_A', 'PO10324_FPU_B')
  AND account ->> '_local_seed' = 'PO-10324:FPU-ToPublish:v1'
  AND account_id IS NULL
  AND account_number IS NULL;

WITH tickets AS (
    SELECT seed.slot,
           seed.business_unit_id,
           bu.business_unit_name,
           ticket.ordinal,
           CASE WHEN ticket.ordinal % 2 = 0 THEN 'PO10324_FPU_A' ELSE 'PO10324_FPU_B' END AS uploader,
           (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') - make_interval(days =>
               CASE ticket.ordinal % 3 WHEN 0 THEN 35 WHEN 1 THEN 7 ELSE 0 END
           ) AS uploaded_at
    FROM fpu_seed_business_units seed
    JOIN public.business_units bu USING (business_unit_id)
    CROSS JOIN LATERAL generate_series(1, seed.ticket_count) AS ticket(ordinal)
)
INSERT INTO public.draft_accounts (
    draft_account_id, business_unit_id, created_date, submitted_by, submitted_by_name,
    account, account_type, account_snapshot, account_status, account_status_date,
    timeline_data, version_number, source, source_reference, status_message
)
SELECT nextval('public.draft_account_id_seq'),
       business_unit_id,
       uploaded_at,
       uploader,
       'Synthetic FPU uploader',
       json_build_object(
           '_local_seed', 'PO-10324:FPU-ToPublish:v1',
           'account_type', 'Fixed Penalty',
           'defendant_type', 'adultOrYouthOnly',
           'defendant', json_build_object(
               'company_flag', false,
               'surname', 'FPU-SEED',
               'forenames', 'SYNTHETIC',
               'dob', NULL
           ),
           'offences', json_build_array()
       ),
       'Fixed Penalty'::public.t_da_account_type_enum,
       json_build_object(
           'account_type', 'Fixed Penalty',
           'created_date', to_char(uploaded_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
           'submitted_by', uploader,
           'submitted_by_name', 'Synthetic FPU uploader',
           'defendant_name', 'SYNTHETIC FPU SEED ' || slot || '-' || ordinal,
           'date_of_birth', NULL,
           'business_unit_name', business_unit_name
       ),
       'SUBMITTED'::public.t_dra_account_status_enum,
       uploaded_at,
       json_build_array(json_build_object(
           'status', 'Submitted',
           'status_date', to_char(uploaded_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
           'username', 'Synthetic FPU uploader',
           'reason_text', NULL
       )),
       0,
       'VPFPO'::public.t_dra_source_enum,
       -(1032400000::bigint + slot * 100 + ordinal),
       'PO-10324 FPU To publish UI seed'
FROM tickets;

-- These are fixture totals; the UI also includes any other eligible drafts in each BU.
SELECT da.business_unit_id,
       bu.business_unit_name,
       count(*) AS tickets,
       count(DISTINCT da.created_date::date) AS upload_dates
FROM public.draft_accounts da
JOIN public.business_units bu USING (business_unit_id)
WHERE da.submitted_by IN ('PO10324_FPU_A', 'PO10324_FPU_B')
  AND da.account ->> '_local_seed' = 'PO-10324:FPU-ToPublish:v1'
  AND da.source = 'VPFPO'
  AND da.account_status = 'SUBMITTED'
GROUP BY da.business_unit_id, bu.business_unit_name
ORDER BY bu.business_unit_name;

COMMIT;
