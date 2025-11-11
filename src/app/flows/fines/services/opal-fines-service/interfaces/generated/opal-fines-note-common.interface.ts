/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { NoteCommonRecordTypeEnum } from '../../types/opal-fines-note-common-record-type-enum.type';
import type { NoteCommonNoteTypeEnum } from '../../types/opal-fines-note-common-note-type-enum.type';

export interface NoteCommon {
  /**
   *
   * @type {string}
   * @memberof NoteCommon
   */
  record_type: (typeof NoteCommonRecordTypeEnum)[keyof typeof NoteCommonRecordTypeEnum];
  /**
   *
   * @type {string}
   * @memberof NoteCommon
   */
  record_id: string;
  /**
   *
   * @type {string}
   * @memberof NoteCommon
   */
  note_text: string;
  /**
   *
   * @type {string}
   * @memberof NoteCommon
   */
  note_type: (typeof NoteCommonNoteTypeEnum)[keyof typeof NoteCommonNoteTypeEnum];
}
