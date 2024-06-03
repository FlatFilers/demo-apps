import { FlatfileEvent, FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import { dedupeEmployees } from '@/workflows/hcm/actions/dedupeEmployees';

export const hcmDedupeEmployees =
  () =>
  (listener: FlatfileListener): void => {
    // Listen for the 'dedupe employees' action
    listener.filter({ job: 'sheet:dedupeEmployees' }, (configure) => {
      configure.on(
        'job:ready',
        async ({ context: { jobId, sheetId } }: FlatfileEvent) => {
          console.log(JSON.stringify(sheetId, null, 2));
          try {
            await api.jobs.ack(jobId, {
              info: 'Checking for duplicates.',
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

                // Call the dedupeEmployees function with the records
                const removeThese = dedupeEmployees(records);
                console.log('Records to Remove: ' + removeThese);
                count = removeThese.length;

                // Check if there are any records to remove
                if (removeThese.length > 0) {
                  // Delete the records identified for removal from the API
                  await api.records.delete(sheetId, { ids: removeThese });
                } else {
                  console.log('No records found for removal.');
                }
              } else {
                console.log('No records found in the response.');
              }
            } catch (error) {
              console.log('Error occurred:', error);
            }

            await api.jobs.complete(jobId, {
              info: `${count} employees deduplicated.`,
            });
          } catch (error) {
            console.error('Error:', error.stack);

            await api.jobs.fail(jobId, {
              info: 'Unable to deduplicate employees.',
            });
          }
        }
      );
    });
  };
