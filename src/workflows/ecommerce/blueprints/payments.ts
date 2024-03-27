import { SheetConfig } from '@flatfile/api/api'

export const payments: SheetConfig = {
  name: 'Payments',
  description: 'A list of customer payments',
  slug: 'payments',
  fields: [
    {
      key: 'payment_id',
      label: 'Payment ID',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'unique' },
        { type: 'external', validator: 'length', config: { min: 1, max: 50 } },
      ],
    },
    {
      key: 'order',
      label: 'Order',
      type: 'reference',
      config: {
        ref: 'orders',
        key: 'order_id',
        relationship: 'has-one',
      },
      constraints: [{ type: 'required' }],
    },
    {
      key: 'payment_date',
      label: 'Payment Date',
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
      key: 'amount',
      label: 'Payment Amount',
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
      key: 'payment_method',
      label: 'Payment Method',
      type: 'enum',
      config: {
        options: [
          { value: 'credit_card', label: 'Credit Card' },
          { value: 'paypal', label: 'PayPal' },
          { value: 'bank_transfer', label: 'Bank Transfer' },
        ],
      },
      constraints: [{ type: 'required' }],
    },
  ],
}
