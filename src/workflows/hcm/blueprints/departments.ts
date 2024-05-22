import { SheetConfig } from '@flatfile/api/api';

export const departments: SheetConfig = {
  name: 'Departments',
  slug: 'departments-sheet',
  readonly: true,
  fields: [
    {
      key: 'departmentCode',
      type: 'string',
      label: 'Department Code',
      description:
        'Unique Identifier for a Department. Also known as Department ID.',
      constraints: [
        {
          type: 'required',
        },
        {
          type: 'unique',
        },
      ],
      readonly: true,
    },
    {
      key: 'departmentName',
      type: 'string',
      label: 'Department Name',
      description: 'The name of the Department.',
      constraints: [
        {
          type: 'required',
        },
      ],
      readonly: true,
    },
  ],
};
