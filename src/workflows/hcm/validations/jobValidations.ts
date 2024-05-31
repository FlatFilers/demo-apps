import { isNil } from '@/shared/validations/validations';
import { FlatfileRecord } from '@flatfile/plugin-record-hook';

export async function jobValidations(records: FlatfileRecord[]) {
  addJobCode(records);
  defaultInactiveAndWarnEffectiveDate(records);
}

export function addJobCode(records: FlatfileRecord[]) {
  for (const record of records) {
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
}

function defaultInactiveAndWarnEffectiveDate(records: FlatfileRecord[]) {
  for (const record of records) {
    try {
      let inactive = record.get('inactive');

      // Set default value for 'inactive' if it is nil
      if (isNil(inactive)) {
        record.set('inactive', false);
        record.addInfo(
          'inactive',
          'Inactive was not provided. Field has been set to false.'
        );
      }

      let effectiveDate = record.get('effectiveDate');

      // Add a warning for 'effectiveDate' if it is nil
      if (isNil(effectiveDate)) {
        record.addWarning(
          'effectiveDate',
          `Effective Date is blank and will default to today's date in HCM Show`
        );
      }
    } catch (err) {
      console.error(err);

      // Add an error message to the record if an error occurs
      record.addError(
        'defaultInactiveAndWarnEffectiveDate',
        `An error occurred: ${err.message}`
      );
    }
  }
}
