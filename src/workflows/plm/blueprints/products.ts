import { SheetConfig } from '@flatfile/api/api'

export const products: SheetConfig = {
  name: 'Products',
  description: 'A list of products',
  slug: 'products',
  fields: [
    {
      key: 'product_id',
      label: 'Product ID',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'unique' },
        { type: 'external', validator: 'length', config: { min: 1, max: 50 } },
      ],
    },
    {
      key: 'name',
      label: 'Product Name',
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
        { type: 'external', validator: 'length', config: { max: 1000 } },
      ],
    },
    {
      key: 'category',
      label: 'Category',
      type: 'reference',
      config: {
        ref: 'product_categories',
        key: 'category_id',
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
        {
          type: 'external',
          validator: 'numberRange',
          config: { min: 0, max: 1000000 },
        },
      ],
    },
    {
      key: 'quantity',
      label: 'Quantity',
      type: 'number',
      constraints: [
        { type: 'required' },
        {
          type: 'external',
          validator: 'numberRange',
          config: { min: 0, max: 1000000 },
        },
      ],
    },

    {
      key: 'currency',
      label: 'Currency',
      type: 'enum',
      description: 'Currency used for the total monetary value of the product',
      config: {
        options: [
          { value: 'USD', label: 'US Dollar' },
          { value: 'EUR', label: 'Euro' },
          { value: 'GBP', label: 'British Pound' },
          { value: 'JPY', label: 'Japanese Yen' },
          { value: 'CAD', label: 'Canadian Dollar' },
          { value: 'AUD', label: 'Australian Dollar' },
          { value: 'CHF', label: 'Swiss Franc' },
          { value: 'CNY', label: 'Chinese Yuan' },
          { value: 'HKD', label: 'Hong Kong Dollar' },
          { value: 'SGD', label: 'Singapore Dollar' },
        ],
      },
      constraints: [{ type: 'required' }],
    },

    {
      key: 'total_value',
      label: 'Total Value',
      type: 'number',
      description:
        'Total monetary value of the product (price × quantity) in provided currency',
      readonly: true,
      constraints: [
        { type: 'computed' },
        {
          type: 'external',
          validator: 'numberRange',
          config: { min: 0, max: 1000000 },
        },
      ],
    },

    {
      key: 'total_value_usd',
      label: 'Total Value USD',
      type: 'number',
      description:
        'Total monetary value of the product (price × quantity) in provided currency',
      readonly: true,
      constraints: [
        { type: 'computed' },
        {
          type: 'external',
          validator: 'numberRange',
          config: { min: 0, max: 1000000 },
        },
      ],
    },

    {
      key: 'image_url',
      label: 'Image URL',
      type: 'string',
      description: 'URL of the product image',
      constraints: [{ type: 'external', validator: 'url' }],
    },
    {
      key: 'supplier',
      label: 'Supplier',
      type: 'reference',
      config: {
        ref: 'suppliers',
        key: 'supplier_id',
        relationship: 'has-one',
      },
      constraints: [{ type: 'required' }],
    },
    {
      key: 'attribute',
      label: 'Attribute',
      type: 'reference',
      config: {
        ref: 'attributes',
        key: 'attribute_id',
        relationship: 'has-many',
      },
    },
    {
      key: 'is_active',
      label: 'Is Active',
      type: 'boolean',
      description: 'Indicates if the product is currently active',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'boolean' },
      ],
    },
    {
      key: 'created_at',
      label: 'Created At',
      type: 'date',
      description: 'The date when the product was created',
      constraints: [
        { type: 'required' },
        {
          type: 'external',
          validator: 'date',
          config: { format: 'yyyy-MM-dd' },
        },
      ],
    },
    {
      key: 'updated_at',
      label: 'Updated At',
      type: 'date',
      description: 'The date when the product was last updated',
      constraints: [
        { type: 'required' },
        {
          type: 'external',
          validator: 'date',
          config: { format: 'yyyy-MM-dd' },
        },
      ],
    },
  ],
}
