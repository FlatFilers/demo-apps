import { PhoneNumberUtil } from 'google-libphonenumber';
import { parse, isValid, format } from 'date-fns';

const phoneUtil = PhoneNumberUtil.getInstance();

// Function to format a date string based on the specified format
function formatDate(dateString, outputFormat) {
  const inputFormats = [
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'MM/dd/yy',
    'M/d/yy',
    'M/d/yyyy',
    'MM/d/yyyy',
    'd/MM/yyyy',
    'dd/MM/yyyy',
    'yyyy/MM/dd',
    // Add more input formats as needed
  ];

  let parsedDate = null;

  // Iterate through the input formats and try to parse the date string
  for (const inputFormat of inputFormats) {
    parsedDate = parse(dateString, inputFormat, new Date());
    if (isValid(parsedDate)) {
      // Check if the parsed year is less than 100 and adjust it if needed
      const year = parsedDate.getFullYear();
      if (year < 100) {
        parsedDate.setFullYear(year + 2000);
      }
      // If the date string is successfully parsed, format it using the specified output format
      return format(parsedDate, outputFormat);
    }
  }

  // If none of the input formats match, return 'Invalid Date'
  return 'Invalid Date';
}

export const externalConstraints = {
  length: {
    validator: (value, key, { config, record }) => {
      if (value) {
        const minLength = config.min || 1;
        const maxLength = config.max;

        if (value.length < minLength || value.length > maxLength) {
          record.addError(
            key,
            `Text must be between ${minLength} and ${maxLength} characters.`
          );
        }
      }
    },
  },
  email: {
    validator: (value, key, { record }) => {
      if (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          record.addError(key, 'Invalid email format.');
        }
      }
    },
  },
  phone: {
    validator: (value, key, { config, record }) => {
      if (value) {
        try {
          const phoneNumber = phoneUtil.parse(value, config.region);
          if (!phoneUtil.isValidNumber(phoneNumber)) {
            record.addError(key, 'Invalid phone number.');
          }
        } catch (error) {
          record.addError(key, 'Invalid phone number format.');
        }
      }
    },
  },
  zipCode: {
    validator: (value, key, { config, record }) => {
      if (value) {
        const zipCodeRegex = /^\d{5}(?:[-\s]\d{4})?$/;
        if (!zipCodeRegex.test(value)) {
          record.addError(
            key,
            `Invalid ${config.countryCode} zip code format.`
          );
        }
      }
    },
  },
  date: {
    validator: (value, key, { config, record }) => {
      if (value) {
        const dateFormat = config.format || 'yyyy-MM-dd'; // Use the format from config or default to 'yyyy-MM-dd'

        // Format the date string using the helper function formatDate and the specified format
        const formattedDate = formatDate(value.trim(), dateFormat);

        // If the formatted date is invalid, add an error to the record
        if (formattedDate === 'Invalid Date') {
          record.addError(
            key,
            `Please check that the date is in the format: ${dateFormat}`
          );
        } else {
          // Update the record with the formatted date
          record.set(key, formattedDate);

          // Add a comment only if the formatted date is different from the original value
          if (formattedDate !== value.trim()) {
            record.addComment(key, `Date has been formatted as ${dateFormat}`);
          }
        }
      }
    },
  },
  url: {
    validator: (value, key, { record }) => {
      if (value) {
        const urlRegex =
          /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlRegex.test(value)) {
          record.addError(key, 'Invalid URL format.');
        }
      }
    },
  },
  dateRange: {
    validator: (value, key, { config, record }) => {
      if (value) {
        const dateFormat = config.format || 'yyyy-MM-dd'; // Use the format from config or default to 'yyyy-MM-dd'

        // Format the date string using the helper function formatDate and the specified format
        const formattedDate = formatDate(value.trim(), dateFormat);

        // If the formatted date is invalid, add an error to the record
        if (formattedDate === 'Invalid Date') {
          record.addError(
            key,
            `Please check that the date is in the format: ${dateFormat}`
          );
        } else {
          // Update the record with the formatted date
          record.set(key, formattedDate);

          // Add a comment only if the formatted date is different from the original value
          if (formattedDate !== value.trim()) {
            record.addComment(key, `Date has been formatted as ${dateFormat}`);
          }

          // Check if the date is within the specified range
          const date = new Date(formattedDate);
          const minDate = config.min ? new Date(config.min) : null;
          const maxDate = config.max ? new Date(config.max) : null;
          if ((minDate && date < minDate) || (maxDate && date > maxDate)) {
            record.addError(
              key,
              `Date must be between ${config.min} and ${config.max}.`
            );
          }
        }
      }
    },
  },
  numberRange: {
    validator: (value, key, { config, record }) => {
      if (value !== undefined && value !== null) {
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
          record.addError(key, 'Invalid numeric value.');
        } else if (numericValue < config.min || numericValue > config.max) {
          record.addError(
            key,
            `Number must be between ${config.min} and ${config.max}.`
          );
        }
      }
    },
  },
  dateTimeRange: {
    validator: (value, key, { config, record }) => {
      if (value) {
        const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
        if (!dateTimeRegex.test(value)) {
          record.addError(
            key,
            'Invalid date/time format. Expected format: yyyy-MM-ddTHH:mm:ss.'
          );
        } else {
          const dateTime = new Date(value);
          const minDateTime = config.min ? new Date(config.min) : null;
          const maxDateTime = config.max ? new Date(config.max) : null;
          if (
            (minDateTime && dateTime < minDateTime) ||
            (maxDateTime && dateTime > maxDateTime)
          ) {
            record.addError(
              key,
              `Date/time must be between ${config.min || 'any'} and ${
                config.max || 'any'
              }.`
            );
          }
        }
      }
    },
  },
  boolean: {
    validator: (value, key, { record }) => {
      if (value) {
        // Define the commonly used synonyms for boolean values
        const synonyms = {
          true: true,
          yes: true,
          y: true,
          on: true,
          1: true,
          false: false,
          no: false,
          n: false,
          off: false,
          0: false,
        };

        // Get the value of the boolean field from the record
        let fieldValue = value;

        // Check if the value is a string and is present in the synonyms object
        if (
          typeof fieldValue === 'string' &&
          fieldValue.toLowerCase() in synonyms
        ) {
          // Map the synonym to its corresponding boolean value
          const mappedValue = synonyms[fieldValue.toLowerCase()];

          // Set the mapped value back to the record
          record.set(key, mappedValue);

          // Add an info message indicating the mapping
          record.addInfo(key, `Value "${fieldValue}" mapped to ${mappedValue}`);
        } else if (typeof fieldValue !== 'boolean') {
          // If the value is not a boolean and not a valid synonym, add an error to the record
          record.addError(key, 'This field must be a boolean');
        }
      }
    },
  },
  number: {
    validator: (value, key, { config, record }) => {
      if (value) {
        const numericValue = Number(value);
        if (Number.isNaN(numericValue)) {
          record.addError(
            key,
            `The field "${key}" should be a number. Please enter a valid numeric value, using a dot (.) as a decimal separator.`
          );
        } else {
          const roundedValue = Number.parseFloat(value).toFixed(
            config.decimalPlaces
          );
          if (value !== roundedValue) {
            record.set(key, roundedValue);
            record.addInfo(key, `${key} has been rounded to 2 decimal places.`);
          }
        }
      }
    },
  },
  contactInfo: {
    validator: (_value, key, { record }) => {
      if (!record.get('email') && !record.get('phoneNumber')) {
        record.addError(
          key,
          'One of the following contact methods is required: Phone Number or Email Address!'
        );
      }
    },
  },
};
