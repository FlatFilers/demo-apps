import { SheetConfig } from '@flatfile/api/api';

export const WORK_ORDERS_SHEET_NAME = 'Work Orders';

export const workOrders: SheetConfig = {
  name: WORK_ORDERS_SHEET_NAME,
  slug: 'work_orders',
  fields: [
    {
      key: 'work_order_id',
      label: 'Work Order ID',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'unique' },
        { type: 'external', validator: 'length', config: { min: 1, max: 50 } },
      ],
    },
    {
      key: 'customer',
      label: 'Customer',
      type: 'reference',
      config: {
        ref: 'customers',
        key: 'customer_id',
        relationship: 'has-one',
      },
      constraints: [{ type: 'required' }],
    },
    {
      key: 'service_location',
      label: 'Service Location',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 200 } },
      ],
    },
    {
      key: 'description',
      label: 'Description',
      type: 'string',
      constraints: [
        { type: 'required' },
        {
          type: 'external',
          validator: 'length',
          config: { min: 2, max: 1000 },
        },
      ],
    },
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
      constraints: [{ type: 'required' }],
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
      constraints: [{ type: 'required' }],
    },
    {
      key: 'scheduled_start',
      label: 'Scheduled Start',
      type: 'date',
      constraints: [
        { type: 'required' },
        {
          type: 'external',
          validator: 'dateRange',
          config: { max: '2100-12-31' },
        },
      ],
    },
    {
      key: 'scheduled_end',
      label: 'Scheduled End',
      type: 'date',
      constraints: [
        { type: 'required' },
        {
          type: 'external',
          validator: 'dateRange',
          config: { min: '2000-01-01' },
        },
      ],
    },
    {
      key: 'assigned_technician',
      label: 'Assigned Technician',
      type: 'reference',
      config: {
        ref: 'technicians',
        key: 'technician_id',
        relationship: 'has-one',
      },
      constraints: [{ type: 'required' }],
    },
    {
      key: 'work_order_type',
      label: 'Work Order Type',
      type: 'string',
      constraints: [
        { type: 'required' },
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
};
