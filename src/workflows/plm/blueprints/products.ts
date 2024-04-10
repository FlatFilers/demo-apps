import { SheetConfig } from '@flatfile/api/api';

export const PRODUCTS_SHEET_NAME = 'Products';

export const products: SheetConfig = {
  name: PRODUCTS_SHEET_NAME,
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
  ],
};
