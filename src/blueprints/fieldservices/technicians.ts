import { SheetConfig } from '@flatfile/api/api'

export const technicians: SheetConfig = {
  name: 'Technicians',
  slug: 'technicians',
  fields: [
    {
      key: 'technician_id',
      label: 'Technician ID',
      type: 'string',
      constraints: [{ type: 'required' }, { type: 'unique' }],
    },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'phone_number', label: 'Phone Number', type: 'string' },
    { key: 'skills', label: 'Skills', type: 'string' },
    { key: 'availability', label: 'Availability', type: 'string' },
    {
      key: 'license_certification',
      label: 'License/Certification',
      type: 'string',
    },
    { key: 'notes', label: 'Notes', type: 'string' },
  ],
}
