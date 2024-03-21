import { SheetConfig } from '@flatfile/api/api'

export const serviceContracts: SheetConfig = {
  name: 'Service Contracts',
  slug: 'service_contracts',
  fields: [
    {
      key: 'contract_id',
      label: 'Contract ID',
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
      key: 'start_date',
      label: 'Start Date',
      type: 'date',
      constraints: [
        { type: 'required' },
        {
          type: 'external',
          validator: 'dateRange',
          config: { max: '2100-12-31', format: 'YYYY-MM-DD' },
        },
      ],
    },
    {
      key: 'end_date',
      label: 'End Date',
      type: 'date',
      constraints: [
        { type: 'required' },
        {
          type: 'external',
          validator: 'dateRange',
          config: { min: '2000-01-01', format: 'YYYY-MM-DD' },
        },
      ],
    },
    {
      key: 'service_level_agreement',
      label: 'Service Level Agreement',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 100 } },
      ],
    },
    {
      key: 'covered_services',
      label: 'Covered Services',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 500 } },
      ],
    },
    {
      key: 'pricing_billing',
      label: 'Pricing/Billing Terms',
      type: 'string',
      constraints: [
        { type: 'required' },
        { type: 'external', validator: 'length', config: { min: 2, max: 500 } },
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
