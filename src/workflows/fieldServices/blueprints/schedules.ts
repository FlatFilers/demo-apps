import { SheetConfig } from '@flatfile/api/api'

export const schedules: SheetConfig = {
  name: 'Schedules',
  slug: 'schedules',
  fields: [
    {
      key: 'schedule_id',
      label: 'Schedule ID',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'unique' },
        { type: 'external', validator: 'length', config: { min: 1, max: 50 } },
      ],
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
      constraints: [{ type: 'required' }],
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
      constraints: [{ type: 'required' }],
    },
    {
      key: 'start_datetime',
      label: 'Start Date/Time',
      type: 'date',
      constraints: [
        { type: 'required' },
        {
          type: 'external',
          validator: 'dateTimeRange',
          config: { max: '2100-12-31T23:59:59' },
        },
      ],
    },
    {
      key: 'end_datetime',
      label: 'End Date/Time',
      type: 'date',
      constraints: [
        { type: 'required' },
        {
          type: 'external',
          validator: 'dateTimeRange',
          config: { min: '2000-01-01T00:00:00' },
        },
      ],
    },
    {
      key: 'location',
      label: 'Location',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 100 } },
      ],
    },
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
      constraints: [{ type: 'required' }],
    },
    {
      key: 'notes',
      label: 'Notes',
      type: 'string',
      constraints: [
        { type: 'external', validator: 'length', config: { max: 500 } },
      ],
    },
  ],
}
