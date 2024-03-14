import { SheetConfig } from '@flatfile/api/api'

export const inventory = {
  name: 'Inventory',
  slug: 'inventory',
  fields: [
    {
      key: 'inventory_id',
      label: 'Inventory ID',
      type: 'string',
      constraints: [{ type: 'required' }, { type: 'unique' }],
    },
    { key: 'item_name', label: 'Item Name', type: 'string' },
    { key: 'description', label: 'Description', type: 'string' },
    { key: 'quantity', label: 'Quantity', type: 'number' },
    {
      key: 'unit_of_measurement',
      label: 'Unit of Measurement',
      type: 'string',
    },
    { key: 'location', label: 'Location', type: 'string' },
    { key: 'reorder_threshold', label: 'Reorder Threshold', type: 'number' },
    {
      key: 'supplier',
      label: 'Supplier',
      type: 'reference',
      config: { ref: 'suppliers', key: 'name', relationship: 'has-one' },
    },
    { key: 'price', label: 'Price', type: 'number' },
    { key: 'notes', label: 'Notes', type: 'string' },
  ],
} as SheetConfig
