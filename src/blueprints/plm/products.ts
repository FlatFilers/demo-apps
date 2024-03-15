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
        {
          type: 'required',
        },
        {
          type: 'unique',
        },
      ],
    },
    {
      key: 'name',
      label: 'Product Name',
      type: 'string',
      constraints: [
        {
          type: 'required',
        },
      ],
    },
    {
      key: 'description',
      label: 'Description',
      type: 'string',
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
    },
    {
      key: 'price',
      label: 'Price',
      type: 'number',
      constraints: [
        {
          type: 'required',
        },
      ],
    },
    {
      key: 'quantity',
      label: 'Quantity',
      type: 'number',
      constraints: [
        {
          type: 'required',
        },
      ],
    },
    {
      key: 'image_url',
      label: 'Image URL',
      type: 'string',
      description: 'URL of the product image',
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
      constraints: [
        {
          type: 'required',
        },
      ],
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
}
