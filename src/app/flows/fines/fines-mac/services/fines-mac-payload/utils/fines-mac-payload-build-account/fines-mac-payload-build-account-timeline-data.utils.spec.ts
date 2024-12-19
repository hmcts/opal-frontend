import { IFinesMacAccountTimelineData } from '../../interfaces/fines-mac-payload-account-timeline-data.interface';
import { finesMacPayloadBuildAccountTimelineData } from './fines-mac-payload-build-account-timeline-data.utils';

describe('finesMacPayloadBuildAccountTimelineData', () => {
  it('should add a new timeline entry to an empty array', () => {
    const username = 'testUser';
    const status = 'active';
    const statusDate = '2023-10-01';
    const reasonText = 'Initial status';
    const timelineData: IFinesMacAccountTimelineData[] = [];

    const result = finesMacPayloadBuildAccountTimelineData(username, status, statusDate, reasonText, timelineData);

    expect(result).toEqual([
      {
        username: 'testUser',
        status: 'active',
        status_date: '2023-10-01',
        reason_text: 'Initial status',
      },
    ]);
  });

  it('should add a new timeline entry to an existing array', () => {
    const username = 'testUser';
    const status = 'inactive';
    const statusDate = '2023-10-02';
    const reasonText = 'Status changed';
    const timelineData: IFinesMacAccountTimelineData[] = [
      {
        username: 'existingUser',
        status: 'active',
        status_date: '2023-09-30',
        reason_text: 'Previous status',
      },
    ];

    const result = finesMacPayloadBuildAccountTimelineData(username, status, statusDate, reasonText, timelineData);

    expect(result).toBe(timelineData);
  });

  it('should handle null reasonText', () => {
    const username = 'testUser';
    const status = 'active';
    const statusDate = '2023-10-01';
    const reasonText = null;
    const timelineData: IFinesMacAccountTimelineData[] = [];

    const result = finesMacPayloadBuildAccountTimelineData(username, status, statusDate, reasonText, timelineData);

    expect(result).toBe(timelineData);
  });

  it('should handle null empty timeline data ', () => {
    const username = 'testUser';
    const status = 'active';
    const statusDate = '2023-10-01';
    const reasonText = 'Initial status';

    const result = finesMacPayloadBuildAccountTimelineData(username, status, statusDate, reasonText, undefined);

    expect(result).toEqual([
      {
        username: 'testUser',
        status: 'active',
        status_date: '2023-10-01',
        reason_text: 'Initial status',
      },
    ]);
  });
});
