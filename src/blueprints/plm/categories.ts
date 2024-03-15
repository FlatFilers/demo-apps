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
      label: 'Category Name',
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
  ],
}
