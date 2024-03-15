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
        {
          type: 'required',
        },
        {
          type: 'unique',
        },
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
    },
    {
      key: 'payment_date',
      label: 'Payment Date',
      type: 'date',
      constraints: [
        {
          type: 'required',
        },
      ],
    },
    {
      key: 'amount',
      label: 'Payment Amount',
      type: 'number',
      constraints: [
        {
          type: 'required',
        },
      ],
    },
    {
      key: 'payment_method',
      label: 'Payment Method',
      type: 'enum',
      config: {
        options: [
          {
            value: 'credit_card',
            label: 'Credit Card',
          },
          {
            value: 'paypal',
            label: 'PayPal',
          },
          {
            value: 'bank_transfer',
            label: 'Bank Transfer',
          },
        ],
      },
    },
  ],
}
