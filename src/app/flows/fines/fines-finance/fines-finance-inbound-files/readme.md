# Variant Banking inbound files

The inbound viewer includes `VARIANT_BANKING` alongside the other inbound sources. The source filter and table display
use the label **Variant Banking**. Searches and downloads use the existing File Handling APIs and shared Finance
download behavior.

## Check with uploaded files

1. Use a user with **View Interface Files** permission and open Finance > Inbound files.
2. Select **Variant Banking** in Source. Select a business unit and a date range that include the uploaded records.
3. Select Refresh. With Type empty, both `SOURCE` (RAW) and `TRANSFORMED_JSON` (TRANSFORMED) records can appear.
4. Check the filename, business unit, source and status for each returned record.
5. Select Download for a Ready or File failed record. Check the saved DAT or JSON content against the original file.
   The response filename is used when supplied; otherwise the displayed filename is retained.

In-Progress records have no download action. `SOURCE_JSON` and `FAILED_SUPERSEDED` records are excluded by the existing
inbound search scope. The default date range is Last 7 days; widen it when checking older uploads.

The backend must already contain the uploaded records. This change adds their source choice and display label to
PO-8674; uploading and downstream processing are separate operations. Existing permissions and HTTP error handling
continue to apply.

## Automated coverage

The inbound component and utility unit specs cover Variant Banking filtering, RAW/TRANSFORMED row labels and downloads
that retain response bytes and filenames. The Cypress inbound-file spec exercises source selection and both download
actions through the rendered viewer using intercepted API responses.
