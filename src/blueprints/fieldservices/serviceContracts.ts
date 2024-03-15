import { SheetConfig } from '@flatfile/api/api'

export const serviceContracts: SheetConfig = {
  name: 'Service Contracts',
  slug: 'service_contracts',
  fields: [
    {
      key: 'contract_id',
      label: 'Contract ID',
      type: 'string',
      constraints: [{ type: 'required' }, { type: 'unique' }],
    },
    {
      key: 'customer',
      label: 'Customer',
      type: 'reference',
      config: { ref: 'customers', key: 'customer_id', relationship: 'has-one' },
    },
    { key: 'start_date', label: 'Start Date', type: 'date' },
    { key: 'end_date', label: 'End Date', type: 'date' },
    {
      key: 'service_level_agreement',
      label: 'Service Level Agreement',
      type: 'string',
    },
    { key: 'covered_services', label: 'Covered Services', type: 'string' },
    { key: 'pricing_billing', label: 'Pricing/Billing Terms', type: 'string' },
    { key: 'notes', label: 'Notes', type: 'string' },
  ],
}
