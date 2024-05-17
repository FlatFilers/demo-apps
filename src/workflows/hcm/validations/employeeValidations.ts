import { HcmShowApiService } from '@/shared/hcm-show-api-service';
import { isNil, isNotNil } from '@/shared/validations/validations';
import { jobValidations } from '@/workflows/hcm/validations/jobValidations';
import { FlatfileEvent } from '@flatfile/listener';
import { FlatfileRecord } from '@flatfile/plugin-record-hook';

export async function employeeValidations(
  records: FlatfileRecord[],
  event: FlatfileEvent
): Promise<FlatfileRecord> {
  let employees;

  try {
    employees = await HcmShowApiService.fetchEmployees(event);
  } catch (error) {
    console.log('Error occurred during API check:', error);
  }

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
    splitFullName(record);
    employeeHours(record);
    jobValidations(record);

    return record;
  });
}

function concatinateNames(record: FlatfileRecord) {
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

function splitFullName(record: FlatfileRecord) {
  try {
    let fullName = record.get('fullName');
    let firstName = record.get('firstName');
    let lastName = record.get('lastName');

    if (
      nameIsPresent(fullName) &&
      !nameIsPresent(firstName) &&
      !nameIsPresent(lastName)
    ) {
      console.log('Parsing full name...');
      const parsedName = parseFullName(fullName);

      const firstName = parsedName.first;
      const lastName = parsedName.last;

      console.log('Setting name fields...');
      record.set('firstName', firstName);
      record.addInfo(
        'firstName',
        `First Name was missing or empty. It has been extracted from the provided Full Name: '${fullName}'.`
      );
      record.set('lastName', lastName);
      record.addInfo(
        'lastName',
        `Last Name was missing or empty. It has been extracted from the provided Full Name: '${fullName}'.`
      );
    }
  } catch (error) {
    console.log('Error occurred during name splitting:', error);
  }

  return record;
}

function parseFullName(fullName) {
  const full = fullName.split(' ');
  const first = full.shift();
  const last = full.join(' ');
  return { first, last };
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

function employeeHours(record: FlatfileRecord) {
  try {
    // Get the values of relevant fields from the record
    const empType = record.get('employeeType');
    const defHours = record.get('defaultWeeklyHours');
    const schedHours = record.get('scheduledWeeklyHours');
    const message = 'Scheduled Weekly Hours calculated based on Employee Type';

    // Validate schedHours if it is a number and not nil
    if (typeof schedHours === 'number' && isNotNil(schedHours)) {
      if (schedHours > 168) {
        // Add an error if schedHours exceeds the maximum allowed hours
        record.addError(
          'scheduledWeeklyHours',
          'Scheduled Hours cannot exceed 168 hours'
        );
      }
    }

    // Validate defHours if it is a number and not nil
    if (typeof defHours === 'number' && isNotNil(defHours)) {
      if (defHours > 168) {
        // Add an error if defHours exceeds the maximum allowed hours
        record.addError(
          'defaultWeeklyHours',
          'Default Weekly Hours cannot exceed 168 hours'
        );
      }
    }

    // Add a warning if schedHours exceeds defHours but is within the allowed range
    if (schedHours > defHours && schedHours <= 168) {
      record.addWarning(
        'scheduledWeeklyHours',
        'Scheduled Hours exceeds Default Hours'
      );
    }

    // Set scheduledWeeklyHours and add info based on empType if schedHours is nil
    if (isNil(schedHours) && empType === 'ft') {
      record.set('scheduledWeeklyHours', 40);
      record.addInfo('scheduledWeeklyHours', message);
    }

    if (isNil(schedHours) && empType === 'pt') {
      record.set('scheduledWeeklyHours', 20);
      record.addInfo('scheduledWeeklyHours', message);
    }

    if (isNil(schedHours) && empType === 'tm') {
      record.set('scheduledWeeklyHours', 40);
      record.addInfo('scheduledWeeklyHours', message);
    }

    if (isNil(schedHours) && empType === 'ct') {
      record.set('scheduledWeeklyHours', 0);
      record.addInfo('scheduledWeeklyHours', message);
    }

    // Calculate and validate FTE if both defHours and schedHours are numbers and not nil
    if (
      typeof defHours === 'number' &&
      isNotNil(defHours) &&
      typeof schedHours === 'number' &&
      isNotNil(schedHours)
    ) {
      const fte = schedHours / defHours;

      if (fte > 999) {
        // Add an error if the calculated FTE exceeds the maximum allowed value
        record.addError(
          'scheduledWeeklyHours',
          `FTE must be 999 or less. FTE is calculated by dividing Scheduled Weekly Hours by Default Weekly Hours. Current FTE is ${fte}.`
        );
      }
    }
  } catch (error) {
    // If an error occurs during the validation, handle the error
    console.error(error);

    // Add an error message to the record indicating the error
    record.addError(
      'employeeId',
      `An error occurred while validating employee hours: ${error.message}`
    );
  }
}
