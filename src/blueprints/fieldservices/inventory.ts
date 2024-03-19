import { SheetConfig } from '@flatfile/api/api'

export const inventory: SheetConfig = {
  name: 'Inventory',
  slug: 'inventory',
  fields: [
    {
      key: 'inventory_id',
      label: 'Inventory ID',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'unique' },
        { type: 'external', validator: 'length', config: { min: 1, max: 50 } },
      ],
    },
    {
      key: 'item_name',
      label: 'Item Name',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 100 } },
      ],
    },
    {
      key: 'description',
      label: 'Description',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { max: 500 } },
      ],
    },
    {
      key: 'quantity',
      label: 'Quantity',
      type: 'number',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'numberRange', config: { min: 0 } },
      ],
    },
    {
      key: 'unit_of_measurement',
      label: 'Unit of Measurement',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 1, max: 20 } },
      ],
    },
    {
      key: 'location',
      label: 'Location',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 100 } },
      ],
    },
    {
      key: 'reorder_threshold',
      label: 'Reorder Threshold',
      type: 'number',
      constraints: [
        { type: 'external', validator: 'numberRange', config: { min: 0 } },
      ],
    },
    {
      key: 'supplier',
      label: 'Supplier',
      type: 'reference',
      config: {
        ref: 'suppliers',
        key: 'name',
        relationship: 'has-one',
      },
      constraints: [{ type: 'required' }],
    },
    {
      key: 'price',
      label: 'Price',
      type: 'number',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'numberRange', config: { min: 0 } },
      ],
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
}
