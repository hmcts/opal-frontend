import { IFinesMacAccountTimelineData } from '../../interfaces/fines-mac-payload-account-timeline-data.interface';

/**
 * Builds and appends a timeline data entry to the provided timeline data array.
 *
 * @param username - The username associated with the timeline entry.
 * @param status - The status of the timeline entry.
 * @param statusDate - The date of the status in the timeline entry.
 * @param reasonText - The reason text associated with the status, if any.
 * @param timelineData - The array of timeline data entries to which the new entry will be appended. Defaults to an empty array.
 * @returns The updated array of timeline data entries.
 */
export const finesMacPayloadBuildAccountTimelineData = (
  username: string,
  status: string,
  statusDate: string,
  reasonText: string | null,
  timelineData: IFinesMacAccountTimelineData[] = [],
) => {
  timelineData.push({
    username,
    status,
    status_date: statusDate,
    reason_text: reasonText,
  });

  return timelineData;
};
