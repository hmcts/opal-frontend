# Signal Form Refactor Plan

**Overall Progress:** `100%`

## Tasks:

- [x] 🟩 **Step 1: Confirm Existing Responsibilities**
  - [x] 🟩 Document current behaviours of `AbstractFormBaseComponent` and related parent helper used by MAC
  - [x] 🟩 List GOV.UK form component dependencies (inputs/outputs) within the comments/notes flow

- [x] 🟩 **Step 2: Specify Signal Abstracts**
  - [x] 🟩 Define expected API and lifecycle for `AbstractSignalFormBaseComponent`
  - [x] 🟩 Decide whether the existing parent base can be reused or a signal-specific variant is required

- [x] 🟩 **Step 3: Prepare Signal GOV.UK Components**
  - [x] 🟩 Clone required GOV.UK controls into signal-centric counterparts
  - [x] 🟩 Align their bindings with Angular’s `model()` pattern and shared styling

- [x] 🟩 **Step 4: Refactor Comments/Notes Components**
  - [x] 🟩 Migrate child form component to use signal abstract + new GOV.UK controls
  - [x] 🟩 Update parent component interactions and adjust payload/state shape as needed

- [x] 🟩 **Step 5: Review Store & Payload Touchpoints**
  - [x] 🟩 Verify store setters/computed values still behave with revised form data
  - [x] 🟩 Identify downstream consumers (payload builders, payment terms, fixed penalty, review account) needing adapters

- [x] 🟩 **Step 6: Outline Validation & Guidance**
  - [x] 🟩 Define verification expectations for this pilot (tests to be updated separately)
  - [x] 🟩 Draft usage notes for adopting the new signal abstractions and components
