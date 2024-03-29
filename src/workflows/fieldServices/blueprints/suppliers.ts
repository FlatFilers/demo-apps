import { SheetConfig } from '@flatfile/api/api'

export const suppliers: SheetConfig = {
  name: 'Suppliers',
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
      constraints: [{ type: 'external', validator: 'email' }],
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
        { type: 'external', validator: 'length', config: { min: 5, max: 200 } },
      ],
    },
    {
      key: 'products_services',
      label: 'Products/Services Offered',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { min: 2, max: 500 } },
      ],
    },
    {
      key: 'pricing_terms',
      label: 'Pricing Terms',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { min: 2, max: 500 } },
      ],
    },
    {
      key: 'notes',
      label: 'Notes',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { max: 1000 } },
      ],
    },
  ],
}
