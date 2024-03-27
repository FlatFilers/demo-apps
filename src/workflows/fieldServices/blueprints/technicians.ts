import { SheetConfig } from '@flatfile/api/api'

export const technicians: SheetConfig = {
  name: 'Technicians',
  slug: 'technicians',
  fields: [
    {
      key: 'technician_id',
      label: 'Technician ID',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'unique' },
        { type: 'external', validator: 'length', config: { min: 1, max: 50 } },
      ],
    },
    {
      key: 'name',
      label: 'Name',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 100 } },
      ],
    },
    {
      key: 'email',
      label: 'Email',
      type: 'string',
      constraints: [{ type: 'external', validator: 'email' }],
    },
    {
      key: 'phone_number',
      label: 'Phone Number',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'phone', config: { region: 'US' } },
      ],
    },
    {
      key: 'skills',
      label: 'Skills',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { min: 2, max: 500 } },
      ],
    },
    {
      key: 'availability',
      label: 'Availability',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { min: 2, max: 100 } },
      ],
    },
    {
      key: 'license_certification',
      label: 'License/Certification',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { min: 2, max: 100 } },
      ],
    },
    {
      key: 'notes',
      label: 'Notes',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { max: 1000 } },
      ],
    },
  ],
}
