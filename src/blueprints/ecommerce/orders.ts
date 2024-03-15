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
        {
          type: 'required',
        },
        {
          type: 'unique',
        },
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
      constraints: [
        {
          type: 'required',
        },
      ],
    },
    {
      key: 'order_date',
      label: 'Order Date',
      type: 'date',
      constraints: [
        {
          type: 'required',
        },
      ],
    },
    {
      key: 'total_amount',
      label: 'Total Amount',
      type: 'number',
      constraints: [
        {
          type: 'required',
        },
      ],
    },
    {
      key: 'status',
      label: 'Order Status',
      type: 'enum',
      config: {
        options: [
          {
            value: 'pending',
            label: 'Pending',
          },
          {
            value: 'processing',
            label: 'Processing',
          },
          {
            value: 'shipped',
            label: 'Shipped',
          },
          {
            value: 'delivered',
            label: 'Delivered',
          },
        ],
      },
    },
  ],
}
