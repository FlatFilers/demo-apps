import { HcmShowApiService } from '@/shared/hcm-show-api-service';
import { FlatfileEvent } from '@flatfile/listener';
import { FlatfileRecord } from '@flatfile/plugin-record-hook';

export async function checkApiForExistingEmployees(
  records: FlatfileRecord[],
  event: FlatfileEvent
): Promise<FlatfileRecord> {
  const employees = await HcmShowApiService.fetchEmployees(event);

  if (!employees) {
    console.log('Failed to fetch employees data from the API');
    return;
  }

  records.map((record: FlatfileRecord) => {
    try {
      // Get the current value of the employeeId field
      let employeeId = record.get('employeeId');
      console.log('employeeId:', employeeId); // Log the current value of employeeId

      // Check if the product_id matches an id from the API data
      const matchingProduct = employees.find(
        (employee: { employeeId: string }) => {
          return String(employee.employeeId) === String(employeeId); // Convert both to strings for comparison
        }
      );

      // If a match is found, add an error to the employeeId field
      if (matchingProduct) {
        console.log('Match found, adding error to employeeId field');
        record.addError(
          'employeeId',
          'Employee ID matches an existing ID in HCM application.'
        );
      }
    } catch (error) {
      console.log('Error occurred during API check:', error); // Log any errors that occurred during the check
      // If an error occurred during the check, add an error to the product_id field
      record.addError('employeeId', "Couldn't process data from the API.");
    }

    return record;
  });
}
