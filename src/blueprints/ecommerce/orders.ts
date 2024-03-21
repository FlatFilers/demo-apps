import { SheetConfig } from '@flatfile/api/api'

export const orders: SheetConfig = {
  name: 'Orders',
  description: 'A list of customer orders',
  slug: 'orders',
  fields: [
    {
      key: 'order_id',
      label: 'Order ID',
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
      key: 'order_date',
      label: 'Order Date',
      type: 'date',
      constraints: [
        { type: 'required' },
        {
          type: 'external',
          validator: 'dateRange',
          config: {
            min: '2000-01-01',
            max: '2100-12-31',
            format: 'YYYY-MM-DD',
          },
        },
      ],
    },
    {
      key: 'total_amount',
      label: 'Total Amount',
      type: 'number',
      constraints: [
        { type: 'required' },
        {
          type: 'external',
          validator: 'numberRange',
          config: { min: 0, max: 1000000 },
        },
      ],
    },
    {
      key: 'status',
      label: 'Order Status',
      type: 'enum',
      config: {
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'processing', label: 'Processing' },
          { value: 'shipped', label: 'Shipped' },
          { value: 'delivered', label: 'Delivered' },
        ],
      },
      constraints: [{ type: 'required' }],
    },
  ],
}
