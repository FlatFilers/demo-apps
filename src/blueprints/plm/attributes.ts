import { SheetConfig } from '@flatfile/api/api'

export const attributes: SheetConfig = {
  name: 'Attributes',
  description: 'A list of product attributes',
  slug: 'attributes',
  fields: [
    {
      key: 'attribute_id',
      label: 'Attribute ID',
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
      label: 'Attribute Name',
      type: 'string',
      constraints: [
        {
          type: 'required',
        },
      ],
    },
    {
      key: 'value',
      label: 'Attribute Value',
      type: 'string',
      constraints: [
        {
          type: 'required',
        },
      ],
    },
    {
      key: 'unit',
      label: 'Unit',
      type: 'string',
    },
  ],
}
