import { SheetConfig } from '@flatfile/api/api'

export const categories: SheetConfig = {
  name: 'Product Categories',
  description: 'A list of product categories',
  slug: 'product_categories',
  fields: [
    {
      key: 'category_id',
      label: 'Category ID',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'unique' },
        { type: 'external', validator: 'length', config: { min: 1, max: 50 } },
      ],
    },
    {
      key: 'name',
      label: 'Category Name',
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
  ],
}
