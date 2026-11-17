# Fixed Penalty Uploads test data

These PostgreSQL scripts populate the **To publish** summary for PO-10324. They use the fines-service `draft_accounts` schema, including the `source` and `source_reference` columns added by migration `V1_369` (PO-10392).

Use a development/test fines database and `psql`. Connection settings come from your normal PostgreSQL configuration (`PGHOST`, `PGPORT`, `PGUSER`, `PGDATABASE`, and your password file). No connection settings or credentials are stored in these scripts.

## Seed

Choose two existing fines Business Units for which your signed-in user has **Publish Fixed Penalties** permission (ID **23**). The current local backend also requires **Create and Manage Draft Accounts** (1) or **Check and Validate Draft Accounts** (5) for each chosen Business Unit when retrieving drafts. You can list available reference data with:

```sql
SELECT business_unit_id, business_unit_name
FROM public.business_units
ORDER BY business_unit_name;
```

Run from the frontend repository root, replacing the example IDs with your chosen IDs:

```sh
psql -X \
  -v first_business_unit_id=77 \
  -v second_business_unit_id=78 \
  -f scripts/test-data/fines-fpu/seed.sql
```

The script creates:

| Business Unit | Submitted VPFPO tickets |
| --- | ---: |
| First configured ID | 7 |
| Second configured ID | 5 |

Tickets span today, 7 days ago, and 35 days ago, with two synthetic uploader IDs. Business Unit names are read from the existing reference table so alphabetical ordering can be checked. The final query prints the fixture totals; existing eligible drafts can increase the totals shown in the UI.

Reopen **Accounts → Fixed Penalty Uploads → To publish** to fetch the new data. Check individual selection, select all, deselect all, and partial selection. A Business Unit without permission 23 should stay hidden.

All rows have an exact `_local_seed` JSON marker and synthetic submitter IDs. Rerunning replaces only matching, unlinked fixtures inside a transaction. Draft IDs come from the existing sequence, which is never reset. The script validates both Business Unit IDs before changing data and stops if a previous fixture has been linked to an account.

The account JSON is for the draft-summary GET journey. It is not a publishable registration: negative `source_reference` values identify synthetic data and do not point to File Handler registrations. The scripts do not create reference data, permissions, or published accounts.

## Cleanup

Using the same database connection:

```sh
psql -X -f scripts/test-data/fines-fpu/cleanup.sql
```

Cleanup matches both the seed marker and synthetic submitter IDs. It also finds fixtures whose status/source was changed during testing, and skips rows with a linked account ID or account number. It is safe to rerun and leaves other draft accounts untouched.

After cleanup, To publish shows its empty state only if no other eligible VPFPO drafts exist for your permitted Business Units.
