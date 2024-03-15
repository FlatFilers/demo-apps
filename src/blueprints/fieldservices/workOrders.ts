import { SheetConfig } from '@flatfile/api/api'

export const workOrders: SheetConfig = {
  name: 'Work Orders',
  slug: 'work_orders',
  fields: [
    {
      key: 'work_order_id',
      label: 'Work Order ID',
      type: 'string',
      constraints: [{ type: 'required' }, { type: 'unique' }],
    },
    {
      key: 'customer',
      label: 'Customer',
      type: 'reference',
      config: { ref: 'customers', key: 'customer_id', relationship: 'has-one' },
    },
    { key: 'service_location', label: 'Service Location', type: 'string' },
    { key: 'description', label: 'Description', type: 'string' },
    {
      key: 'status',
      label: 'Status',
      type: 'enum',
      config: {
        options: [
          { value: 'open', label: 'Open' },
          { value: 'assigned', label: 'Assigned' },
          { value: 'in progress', label: 'In Progress' },
          { value: 'completed', label: 'Completed' },
        ],
      },
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'enum',
      config: {
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ],
      },
    },
    { key: 'scheduled_start', label: 'Scheduled Start', type: 'date' },
    { key: 'scheduled_end', label: 'Scheduled End', type: 'date' },
    {
      key: 'assigned_technician',
      label: 'Assigned Technician',
      type: 'reference',
      config: {
        ref: 'technicians',
        key: 'technician_id',
        relationship: 'has-one',
      },
    },
    { key: 'work_order_type', label: 'Work Order Type', type: 'string' },
    { key: 'notes', label: 'Notes', type: 'string' },
  ],
}
