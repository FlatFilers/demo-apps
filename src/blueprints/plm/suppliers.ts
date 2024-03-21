import { SheetConfig } from '@flatfile/api/api'

export const suppliers: SheetConfig = {
  name: 'Suppliers',
  description: 'A list of suppliers',
  slug: 'suppliers',
  fields: [
    {
      key: 'supplier_id',
      label: 'Supplier ID',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'unique' },
        { type: 'external', validator: 'length', config: { min: 1, max: 50 } },
      ],
    },
    {
      key: 'name',
      label: 'Supplier Name',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 100 } },
      ],
    },
    {
      key: 'email',
      label: 'Email',
      type: 'string',
      constraints: [{ type: 'external', validator: 'email' }],
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
        { type: 'external', validator: 'length', config: { min: 5, max: 200 } },
      ],
    },
    {
      key: 'city',
      label: 'City',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { min: 2, max: 100 } },
      ],
    },
    {
      key: 'state',
      label: 'State',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { min: 2, max: 100 } },
      ],
    },
    {
      key: 'country',
      label: 'Country',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { min: 2, max: 100 } },
      ],
    },
  ],
}
