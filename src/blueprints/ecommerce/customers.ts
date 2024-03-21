import { SheetConfig } from '@flatfile/api/api'

export const customers: SheetConfig = {
  name: 'Customers',
  description: 'A list of customers',
  slug: 'customers',
  fields: [
    {
      key: 'customer_id',
      label: 'Customer ID',
      type: 'string',
      constraints: [{ type: 'required' }, { type: 'unique' }],
    },
    {
      key: 'first_name',
      label: 'First Name',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 50 } },
      ],
    },
    {
      key: 'last_name',
      label: 'Last Name',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 50 } },
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
      key: 'phone',
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
        { type: 'external', validator: 'length', config: { min: 5, max: 100 } },
      ],
    },
    {
      key: 'city',
      label: 'City',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 50 } },
      ],
    },
    {
      key: 'state',
      label: 'State',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 50 } },
      ],
    },
    {
      key: 'zip_code',
      label: 'Zip Code',
      type: 'string',
      constraints: [
        { type: 'required' },
        {
          type: 'external',
          validator: 'zipCode',
          config: { countryCode: 'US' },
        },
      ],
    },
    {
      key: 'country',
      label: 'Country',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 50 } },
      ],
    },
    {
      key: 'website',
      label: 'Website',
      type: 'string',
      constraints: [{ type: 'external', validator: 'url' }],
    },
    {
      key: 'registration_date',
      label: 'Registration Date',
      type: 'date',
      constraints: [
        { type: 'required' },
        {
          type: 'external',
          validator: 'date',
          config: { format: 'YYYY-MM-DD' },
        },
      ],
    },
  ],
}
