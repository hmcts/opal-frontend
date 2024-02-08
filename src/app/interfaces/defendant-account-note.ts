export interface IDefendantAccountNote {
  noteId: number;
  noteType: string;
  associatedRecordType: string;
  associatedRecordId: string;
  noteText: string;
  postedDate: string;
  postedBy: null | string;
}
