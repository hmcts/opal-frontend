# Variant Banking file upload

The route `/fines/finance/variant-banking-files/upload` uploads valid selections immediately, one file at a time.
The [page component](./fines-finance-upload-variant-banking-files.component.ts) owns per-file validation, queued requests,
progress, row outcomes and cancellation. Its [child form](./fines-finance-upload-variant-banking-files-form/fines-finance-upload-variant-banking-files-form.component.ts)
configures the shared MoJ picker's selection limit, composes the file list and supplies an accessible live region.

Completed and rejected rows remain visible while later selections can be added. Back returns to Finance; the route
and browser leave-page guards warn while files are pending or uploading. Destroying the page cancels the active
request and prevents queued files from starting. The inbound-files link is available separately to authorised viewers.

## Validation and permissions

The [feature configuration](./constants/fines-finance-variant-banking-upload.constant.ts) retains the ticket policy:

- DAT files, checked case-insensitively.
- At most 2 MiB per file (`2 * 1024 * 1024` bytes, including the exact boundary).
- At most six files per picker/drop selection, enforced by the shared picker's `[maxFiles]` input; this is not a
  cumulative limit across selections.
- Ticket filenames matching `/^a121_\d{6}_VB_\d{3}_\d{2}\.dat$/i`, for example `a121_261027_VB_077_01.dat`,
  with a two-digit numeric sequence suffix.

The child passes its `maxFiles` value of `6` to the shared input and supplies matching `maxFilesErrorMessage` and
`fieldErrors.files.maxFiles` text. Selecting or dropping seven files rejects the whole batch before `filesSelected`:
none of those files creates a row or API request, and no accepted prefix is uploaded. Existing rows and the previous
file-control value are preserved. The parent validates the types, sizes and filenames of batches emitted by the picker.

The frontend renders its standard `GovukErrorSummaryComponent` above the page heading. The child's `statusChanges`
listener detects the `maxFiles` error and immediately displays and focuses the summary. Its link targets `#files` and
focuses the native picker. A new selection within the limit or a reset clears the count summary. Selections within the
limit proceed immediately to parent validation and the upload queue.

Type, size and filename failures receive explanatory row errors and are not sent to the API. Upload errors also stay
in their file rows; these per-file errors are not added to the page summary. Original filenames are preserved.
The [route](../routing/fines-finance.routes.ts) requires authentication and `upload-variant-banking-files` permission
(`Upload Variant Banking Files`, ID `27`). `view-interface-files` (ID `18`) is independently required for the
inbound-files link and destination; upload permission alone does not grant that navigation.
The upload and both file-viewer routes also use the `release-1c-banking-interfaces` feature flag.

The inspected File Handler backend still checks `CREATE_INTERFACE_FILES` when adding a file. Its Variant Banking
authorisation must be aligned to `Upload Variant Banking Files` for end-to-end access with permission `27` alone.

## Upload API and transport

The page calls `OpalFileHandlingService.uploadInterfaceFile` once per valid file:

```text
POST /opal-file-handling-service/interface-files
Content-Type: multipart/form-data; boundary=<browser-generated>
```

The shared client constructs two parts: `file` contains the original binary file and filename; `metadata` is an
`application/json` Blob named `metadata.json` with this payload:

```json
{
  "file_name": "a121_261027_VB_077_01.dat",
  "source": "VARIANT_BANKING",
  "target": "OPAL",
  "type": "SOURCE",
  "domain": "FINES",
  "should_pre_process_file": true
}
```

There are no upload query parameters. SOURCE uploads omit business-unit metadata; the backend derives it from the
filename. Payment type is derived from BACS content. The existing server proxy supplies session authentication.
Let the browser set the multipart boundary; the request is not JSON or base64 file content.

The [route-scoped HTTP provider](./providers/fines-finance-variant-banking-upload.provider.ts) retains digest, retry and
DI interceptors while keeping upload errors local to the file list. Its shared transport helper uses XHR for browser
requests with `reportProgress`, and Fetch for other requests and server rendering. Fetch alone does not provide upload
progress. Unknown totals remain indeterminate; 100% transferred remains uploading until the final response.

An HTTP 201 is not sufficient for success. The page accepts only `SUCCESS` or `SUCCESS_NO_TRANSACTIONS` with no ingestion
error. Other statuses, missing responses and streams completing without a response fail the row. API `errors` may be
a JSON-encoded string containing `message`; HTTP errors use `FileService` message formatting, with a fallback when no
usable message exists. A failed file does not stop later queued uploads.

## Backend dependencies and known limitations

The inspected backend reference is `opal-file-handler-service` branch `PO-8745`, commit `d60cfa4e`.
Its [upload schema](https://github.com/hmcts/opal-file-handler-service/blob/d60cfa4e/src/main/resources/openapi/InterfaceFile.yaml)
and [controller integration tests](https://github.com/hmcts/opal-file-handler-service/blob/d60cfa4e/src/integrationTest/java/uk/gov/hmcts/opal/filehandler/controllers/AddInterfaceFileTest.java)
confirm the multipart contract and 201 responses containing either success or duplicate outcomes.
The inspected `origin/master` commit `a05ccce3` on 9 November 2026 does not yet include Variant Banking support;
a backend deployment containing that support is required for this journey.

**Filename mismatch remains open.** The active PO-8745 extractor requires
`^a121_\d{6}VB\d{3}_\d{2}\.dat$`, such as `a121_003500VB123_13.dat`. This conflicts with the ticket's separator
underscores around `VB`. The agreed frontend decision is to keep the ticket format and flag the backend mismatch, rather
than rename files or bypass preprocessing. Transaction-bearing files accepted by the frontend can therefore fail
backend preprocessing until the contracts are aligned. See the
[Variant Banking extractor](https://github.com/hmcts/opal-file-handler-service/blob/d60cfa4e/src/main/java/uk/gov/hmcts/opal/filehandler/service/extraction/VariantBacsStandard18BaisExtractionService.java).

The API returns the original SOURCE record. In the inspected backend, a SOURCE_JSON blob/queue failure can mark only
the child record failed while the returned SOURCE still reports SUCCESS. That child outcome is not exposed by this
response; the frontend cannot infer it or manufacture a correction. This remains a backend contract limitation.

## Unit tests

Run from the frontend repository root:

```bash
corepack yarn test \
  --include='src/app/flows/fines/fines-finance/fines-finance-upload-variant-banking-files/**/*.spec.ts' \
  --include='src/app/flows/fines/fines-finance/routing/fines-finance.routes.spec.ts'
```

The feature specs cover whole-batch count rejection without rows or requests, immediate count-summary display/focus
and clearing, per-file validation, sequential mixed outcomes, response-status handling, progress, permissions and
leaving the page. Per-file validation and upload errors remain in their rows. Routing specs cover the isolated HTTP
client and browser/SSR transports. In the sibling common UI
checkout, the [shared service HTTP tests](https://github.com/hmcts/opal-frontend-common-ui-lib/blob/PO-8684/projects/opal-frontend-common/services/opal-file-handling-service/opal-file-handling.service.spec.ts)
cover multipart bytes/metadata, progress and response/error forwarding; the
[transport helper tests](https://github.com/hmcts/opal-frontend-common-ui-lib/blob/PO-8684/projects/opal-frontend-common/interceptors/helpers/upload-progress-http-backend.spec.ts)
cover backend selection. These are unit tests, not evidence that the deployed backend accepts the ticket filename.
