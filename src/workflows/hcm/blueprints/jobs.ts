import { SheetConfig } from '@flatfile/api/api';

export const jobs: SheetConfig = {
  name: 'Jobs',
  slug: 'jobs-sheet',
  readonly: false,
  fields: [
    // Jobs Fields

    //Validate against exisitng Job Codes in DB - call out the ID already exists & this would be an update and not a create
    //If blank, Can we create this by replace all spaces with underscores and include an info message that this was set programatically?
    {
      key: 'jobCode',
      type: 'string',
      label: 'Job Code',
      description: 'Unique Identifier for a Job. Also known as Job ID.',
      constraints: [
        { type: 'required' },
        { type: 'unique' },
        { type: 'external', validator: 'jobCode' },
      ],
      readonly: false,
    },
    {
      key: 'jobName',
      type: 'string',
      label: 'Job Name',
      description: 'The name of the job.',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 1, max: 50 } },
      ],
      readonly: false,
    },
    {
      key: 'jobDept',
      type: 'reference',
      label: 'Job Department',
      description: 'The department of the job.',
      constraints: [],
      readonly: false,
      config: {
        ref: 'departments-sheet',
        key: 'departmentName',
        relationship: 'has-many',
      },
    },
    {
      // May want to throw a warning if missing to say this will default to today. May also want to default to 01-01-1900
      //Includes validate function that warns if left blank that it will default to today's date in HCM.show
      //Was SmartDateField previously

      key: 'effectiveDate',
      type: 'date',
      label: 'Effective Date',
      description:
        'On update of a job, this is the date the change to the Job will take effect. Will default to today if not submitted. During implementation, we recommend using a date of 1900-01-01 for the initial entry.',
      constraints: [
        {
          type: 'external',
          validator: 'date',
        },
      ],
      readonly: false,
    },
    {
      // May want to default this to True or allow this to be specified dynamically
      // Includes defaulting - Inactive was not provided. Field has been set to false by default.

      key: 'inactive',
      type: 'boolean',
      label: 'Inactive',
      description:
        'Boolean attribute indicates if the Job Profile is inactive.',
      constraints: [{ type: 'external', validator: 'boolean' }],
      readonly: false,
    },
  ],
};
