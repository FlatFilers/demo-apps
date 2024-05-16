import { HcmShowApiService } from '@/shared/hcm-show-api-service';
import { FlatfileEvent } from '@flatfile/listener';
import { FlatfileRecord } from '@flatfile/plugin-record-hook';

export async function employeeValidations(
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

      // Check if the employeeId matches an id from the API data
      const matchingEmployees = employees.find((employee) => {
        return String(employee) === String(employeeId); // Convert both to strings for comparison
      });

      // If a match is found, add an error to the employeeId field
      if (matchingEmployees) {
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

    concatinateNames(record);

    return record;
  });
}

export function concatinateNames(record: FlatfileRecord) {
  console.log('Concatenating names for record:', record);
  try {
    let fullName = record.get('fullName');
    let firstName = record.get('firstName');
    let lastName = record.get('lastName');

    if (
      !nameIsPresent(fullName) &&
      nameIsPresent(firstName) &&
      nameIsPresent(lastName)
    ) {
      firstName = cleanName(firstName);
      lastName = cleanName(lastName);
      fullName = `${firstName} ${lastName}`;
      record.addInfo(
        'fullName',
        `Full Name was missing or empty. It has been filled by concatenating the provided First Name: '${firstName}' and Last Name: '${lastName}'.`
      );
    } else {
      cleanName(fullName);
    }
    record.set('fullName', fullName);
  } catch (error) {
    console.log('Error occurred during name concatenation:', error);
  }

  return record;
}

function cleanName(name) {
  if (name === null || name === undefined) {
    return '';
  }
  return name.trim().replace(/\s+/g, ' ');
}

function nameIsPresent(name) {
  return name && name.trim().length > 0;
}
