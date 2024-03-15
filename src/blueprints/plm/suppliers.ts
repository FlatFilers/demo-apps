import { SheetConfig } from '@flatfile/api/api'

export const suppliers: SheetConfig = {
  name: 'Suppliers',
  description: 'A list of suppliers',
  slug: 'suppliers',
  fields: [
    {
      key: 'supplier_id',
      label: 'Supplier ID',
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
      label: 'Supplier Name',
      type: 'string',
      constraints: [
        {
          type: 'required',
        },
      ],
    },
    {
      key: 'email',
      label: 'Email',
      type: 'string',
      metadata: {
        validationType: 'EMAIL',
      },
    },
    {
      key: 'phone',
      label: 'Phone Number',
      type: 'string',
      metadata: {
        format: 'phone',
      },
    },
    {
      key: 'address',
      label: 'Address',
      type: 'string',
    },
    {
      key: 'city',
      label: 'City',
      type: 'string',
    },
    {
      key: 'state',
      label: 'State',
      type: 'string',
    },
    {
      key: 'country',
      label: 'Country',
      type: 'string',
    },
  ],
}
