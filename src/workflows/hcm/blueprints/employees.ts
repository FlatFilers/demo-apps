import { SheetConfig } from '@flatfile/api/api';

export const employees: SheetConfig = {
  name: 'Employees',
  slug: 'employees-sheet',
  readonly: false,
  fields: [
    {
      //Validations
      //Enter a unique Employee ID. The ID is already in use by [Employee][EmployeeNew].
      //Validate against exisitng Employee in DB - call out the ID already exists & this would be an update and not a create

      key: 'employeeId',
      type: 'string',
      label: 'Employee ID',
      description: 'Unique Identifier for a Employee.',
      constraints: [
        {
          type: 'required',
        },
        {
          type: 'unique',
        },
      ],
      readonly: false,
    },
    {
      // This will need to be a valid Employee ID from either the DB or the existing dataset. If not, throw an error
      key: 'managerId',
      type: 'reference',
      label: 'Manager ID',
      description: "The Employee ID for the Employee's Manager",
      constraints: [
        {
          type: 'required',
        },
      ],
      readonly: false,
      config: {
        ref: 'employees-sheet',
        key: 'employeeId',
        relationship: 'has-many',
      },
    },
    {
      key: 'fullName',
      type: 'string',
      label: 'Full Name',
      description: 'The Full Name for a person.',
      readonly: true,
    },
    {
      key: 'firstName',
      type: 'string',
      label: 'First Name',
      description: 'The First Name (Given Name) for a person.',
      constraints: [
        {
          type: 'required',
        },
      ],
      readonly: false,
    },
    {
      key: 'lastName',
      type: 'string',
      label: 'Last Name',
      description: 'The Last Name (Family Name) for a person.',
      constraints: [
        {
          type: 'required',
        },
      ],
      readonly: false,
    },

    // This will need to be a valid Employee Type based on the list of Employee Types configured in DB
    {
      key: 'employeeType',
      type: 'enum',
      label: 'Employee Type',
      description: "The worker's employee type.",
      constraints: [
        {
          type: 'required',
        },
      ],
      readonly: false,
      config: {
        options: [
          {
            value: 'ft',
            label: 'Full-Time',
          },
          {
            value: 'pt',
            label: 'Part-Time',
          },
          {
            value: 'tm',
            label: 'Temporary',
          },
          {
            value: 'ct',
            label: 'Contract',
          },
        ],
      },
    },

    //May need to check for dates in future or set a cutoff for dates
    //Was SmartDateField previously
    {
      key: 'hireDate',
      type: 'date',
      label: 'Hire Date',
      description:
        "The worker's Hire Date. The Hire Date must be on or after the effective date of any changes to the position or location.",
      constraints: [
        {
          type: 'required',
        },
        {
          type: 'external',
          validator: 'date',
          config: { format: 'yyyy-MM-dd' },
        },
      ],
      readonly: false,
    },
    {
      // Validations
      //End Employment Date must be after Hire Date.
      key: 'endEmploymentDate',
      type: 'date',
      label: 'End Employment Date',
      description:
        'The End Employment Date for the position of fixed term or temporary employees.',
      constraints: [
        {
          type: 'external',
          validator: 'date',
          config: { format: 'yyyy-MM-dd' },
        },
      ],
      readonly: false,
    },
    {
      // Validate that hire date is on or after effective date of Job Code
      key: 'jobName',
      type: 'reference',
      label: 'Job Name',
      description: 'The Job Profile for the Employee.',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 1, max: 50 } },
      ],
      readonly: false,
      config: {
        ref: 'jobs-sheet',
        key: 'jobName',
        relationship: 'has-many',
      },
    },
    {
      // Read only field, looked up based on jobName
      key: 'jobCode',
      type: 'string',
      label: 'Job Code',
      description: 'The Job Code for the Employee.',
      constraints: [
        {
          type: 'computed',
        },
      ],
      readonly: true,
    },
    {
      // If left blank, will default to department title from Job Code
      key: 'positionTitle',
      type: 'string',
      label: 'Position Title',
      description: "The Position Title of the Employee's position.",
      constraints: [],
      readonly: false,
    },
    {
      //Validation
      //May default to Locations hours
      //Enter a value of 168 hours or fewer.
      key: 'defaultWeeklyHours',
      type: 'number',
      label: 'Default Weekly Hours',
      description: 'The default weekly hours of the Employee',
      constraints: [
        {
          type: 'required',
        },
      ],
      readonly: false,
    },
    {
      //Validation
      //May default to Locations hours
      //FTE must be 999 or less.
      //The scheduled weekly hours cannot be negative.
      //Enter a value of 168 hours or fewer.
      key: 'scheduledWeeklyHours',
      type: 'number',
      label: 'Scheduled Weekly Hours',
      description: 'The scheduled weekly hours of the Employee',
      constraints: [
        {
          type: 'required',
        },
      ],
      readonly: false,
    },
    {
      //Email addresses must be in the format of 'xxx@yy.com'. Valid examples: john.doe@aol.com, jane@aol.com.
      key: 'emailAddress',
      type: 'string',
      label: 'Email Address',
      description:
        "The email address of the Employee. Email addresses must be in the format of 'xxx@yy.com'. Valid examples: john.doe@aol.com, jane@aol.com.",
      constraints: [
        {
          type: 'external',
          validator: 'email',
        },
        {
          type: 'external',
          validator: 'contactInfo',
        },
      ],
      readonly: false,
    },
    {
      key: 'password',
      type: 'string',
      label: 'Password',
      description:
        'The password for the account. Ensure that the password is strong and includes a combination of letters, numbers, and special characters.',
      constraints: [
        {
          type: 'required',
        },
      ],
      readonly: false,
    },

    {
      //Validation
      //Numbers only, must match format specified by country - have used npm package in the past for this
      //Can we "clean" this field to remove all foreign characters, but present the original value in an info message?
      key: 'phoneNumber',
      type: 'string',
      label: 'Phone Number',
      description: '',
      constraints: [
        {
          type: 'external',
          validator: 'contactInfo',
        },
      ],
      readonly: false,
    },
  ],
  actions: [
    {
      operation: 'dedupeEmployees',
      label: 'Remove Duplicate Employee Records',
      description:
        'This custom action code analyzes a set of employee records and identifies duplicate entries based on employee ID and hire date. It removes duplicate records, prioritizing those with earlier hire dates.',
      primary: false,
      mode: 'foreground',
      type: 'string',
    },
    {
      operation: 'validateReportingStructure',
      label: 'Validate Reporting Structure',
      description:
        'This custom action code analyzes a set of employee records and validates the reporting structure. It checks for circular dependencies, ensures there is a single top-level manager, and verifies that employees are reporting to existing managers.',
      primary: false,
      mode: 'foreground',
      type: 'string',
    },
  ],
};
