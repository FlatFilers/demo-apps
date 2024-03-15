import { SheetConfig } from '@flatfile/api/api'

export const schedules: SheetConfig = {
  name: 'Schedules',
  slug: 'schedules',
  fields: [
    {
      key: 'schedule_id',
      label: 'Schedule ID',
      type: 'string',
      constraints: [{ type: 'required' }, { type: 'unique' }],
    },
    {
      key: 'technician',
      label: 'Technician',
      type: 'reference',
      config: {
        ref: 'technicians',
        key: 'technician_id',
        relationship: 'has-one',
      },
    },
    {
      key: 'work_order',
      label: 'Work Order',
      type: 'reference',
      config: {
        ref: 'work_orders',
        key: 'work_order_id',
        relationship: 'has-one',
      },
    },
    { key: 'start_datetime', label: 'Start Date/Time', type: 'date' },
    { key: 'end_datetime', label: 'End Date/Time', type: 'date' },
    { key: 'location', label: 'Location', type: 'string' },
    {
      key: 'status',
      label: 'Status',
      type: 'enum',
      config: {
        options: [
          { value: 'scheduled', label: 'Scheduled' },
          { value: 'in progress', label: 'In Progress' },
          { value: 'completed', label: 'Completed' },
        ],
      },
    },
    { key: 'notes', label: 'Notes', type: 'string' },
  ],
}
