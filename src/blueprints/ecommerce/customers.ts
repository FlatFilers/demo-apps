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
      constraints: [
        { type: 'required' },
        { type: 'unique' },
      ],
    },
    {
      key: 'first_name',
      label: 'First Name',
      type: 'string',
      constraints: [
        { type: 'required' },
      ],
    },
    {
      key: 'last_name',
      label: 'Last Name',
      type: 'string',
      constraints: [
        { type: 'required' },
      ],
    },
    {
      key: 'email',
      label: 'Email',
      type: 'string',
    },
    {
      key: 'phone',
      label: 'Phone Number',
      type: 'string',
    },
    {
      key: 'address',
      label: 'Address',
      type: 'string',
    },
    {
      key: 'city',
      label: 'City',
      type: 'string',
    },
    {
      key: 'state',
      label: 'State',
      type: 'string',
    },
    {
      key: 'country',
      label: 'Country',
      type: 'string',
    },
  ],
}