import { SheetConfig } from '@flatfile/api/api';

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
        { type: 'required' },
        { type: 'unique' },
        { type: 'external', validator: 'length', config: { min: 1, max: 50 } },
      ],
    },
    {
      key: 'name',
      label: 'Attribute Name',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 100 } },
      ],
    },
    {
      key: 'value',
      label: 'Attribute Value',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 1, max: 200 } },
      ],
    },
    {
      key: 'unit',
      label: 'Unit',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { max: 50 } },
      ],
    },
  ],
};
