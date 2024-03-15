import { SheetConfig } from '@flatfile/api/api'

export const suppliers: SheetConfig = {
  name: 'Suppliers',
  slug: 'suppliers',
  fields: [
    {
      key: 'supplier_id',
      label: 'Supplier ID',
      type: 'string',
      constraints: [{ type: 'required' }, { type: 'unique' }],
    },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'contact_person', label: 'Contact Person', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'phone_number', label: 'Phone Number', type: 'string' },
    { key: 'address', label: 'Address', type: 'string' },
    {
      key: 'products_services',
      label: 'Products/Services Offered',
      type: 'string',
    },
    { key: 'pricing_terms', label: 'Pricing Terms', type: 'string' },
    { key: 'notes', label: 'Notes', type: 'string' },
  ],
}
