import { FlatfileEvent, FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import { validateReportingStructure } from '@/workflows/hcm/actions/validateReportingStructure';

export const hcmValidateReportingStructure =
  () =>
  (listener: FlatfileListener): void => {
    listener.filter(
      { job: 'sheet:validateReportingStructure' },
      (configure) => {
        configure.on(
          'job:ready',
          async ({ context: { jobId, sheetId } }: FlatfileEvent) => {
            try {
              await api.jobs.ack(jobId, {
                info: 'Validating reporting structure.',
                progress: 10,
              });

              let count = 0;
              try {
                console.log('Sheet ID: ' + sheetId);

                // Call the 'get' method of api.records with the sheetId
                const response = await api.records.get(sheetId);

                // Check if the response is valid and contains records
                if (response?.data?.records) {
                  const records = response.data.records;

                  // Call the validateReportingStructure function with the records
                  const reportingErrors = validateReportingStructure(records);
                  count = reportingErrors.length;

                  // Update the records if there are any reporting errors
                  if (reportingErrors.length > 0) {
                    await api.records.update(sheetId, reportingErrors);
                    console.log('Records updated successfully.');
                    // For example, you can send them as a notification or store them in a database
                  } else {
                    console.log('No records found for updating.');
                  }
                } else {
                  console.log('No records found in the response.');
                }
              } catch (error) {
                console.log('Error occurred:' + error);
              }

              await api.jobs.complete(jobId, {
                info: `${count} records found and flagged.`,
              });
            } catch (error) {
              console.error('Error:', error.stack);

              await api.jobs.fail(jobId, {
                info: 'Unable to validate reporting structure.',
              });
            }
          }
        );
      }
    );
  };
