import { FlatfileRecord } from '@flatfile/plugin-record-hook';
import { isNil, isNotNil } from '@/shared/validations/validations';

export async function jobValidations(
  record: FlatfileRecord
): Promise<FlatfileRecord> {
  // validateJobDates(record);
  addJobCode(record);

  return record;
}

function addJobCode(record: FlatfileRecord) {
  const jobName = record.get('jobName') as string;
  let jobCode = record.get('jobCode') as string;
  let jobNamePresent = jobName && jobName.trim().length > 0;

  if (!jobCode && jobNamePresent) {
    jobCode = jobName.replace(/[,\s-]+/g, '_').replace(/&/g, 'and');

    // Set the generated job code in the record
    record.set('jobCode', jobCode);

    // Add an info message indicating that the job code has been automatically generated
    record.addInfo(
      'jobCode',
      'Job Code was not provided, this has been automatically generated for use in HCM Show'
    );
  }
}
