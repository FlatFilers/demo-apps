import { SheetConfig } from '@flatfile/api/api'

export const customers = {
  name: 'Customers',
  slug: 'customers',
  fields: [
    {
      key: 'customer_id',
      label: 'Customer ID',
      type: 'string',
      constraints: [{ type: 'required' }, { type: 'unique' }],
    },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'contact_person', label: 'Contact Person', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'phone_number', label: 'Phone Number', type: 'string' },
    { key: 'address', label: 'Address', type: 'string' },
    {
      key: 'preferred_contact_method',
      label: 'Preferred Contact Method',
      type: 'string',
    },
    { key: 'notes', label: 'Notes', type: 'string' },
  ],
} as SheetConfig
