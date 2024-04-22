import { SheetConfig } from '@flatfile/api/api';

export const CUSTOMERS_SHEET_NAME = 'Customers';

export const customers: SheetConfig = {
  name: CUSTOMERS_SHEET_NAME,
  slug: 'customers',
  fields: [
    {
      key: 'customer_id',
      label: 'Customer ID',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'unique' },
        { type: 'external', validator: 'length', config: { min: 1, max: 50 } },
      ],
    },
    {
      key: 'name',
      label: 'Name',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 100 } },
      ],
    },
    {
      key: 'contact_person',
      label: 'Contact Person',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { min: 2, max: 100 } },
      ],
    },
    {
      key: 'email',
      label: 'Email',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'email' },
      ],
    },
    {
      key: 'phone_number',
      label: 'Phone Number',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'phone', config: { region: 'US' } },
      ],
    },
    {
      key: 'address',
      label: 'Address',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 5, max: 200 } },
      ],
    },
    {
      key: 'preferred_contact_method',
      label: 'Preferred Contact Method',
      type: 'enum',
      config: {
        options: [
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
          { value: 'mail', label: 'Mail' },
        ],
      },
      constraints: [{ type: 'required' }],
    },
    {
      key: 'notes',
      label: 'Notes',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { max: 500 } },
      ],
    },
  ],
};
