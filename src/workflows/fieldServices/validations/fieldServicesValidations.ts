// productsValidations.ts
import { FlatfileRecord } from '@flatfile/hooks'

export function validateTotalValue(record: FlatfileRecord) {
  const price = record.get('price') as number
  const quantity = record.get('quantity') as number

  if (price !== undefined && quantity !== undefined) {
    const totalValue = price * quantity
    record.set('total_value', totalValue)
  } else {
    console.log('Price and quantity are required to calculate total value')
    record.addError(
      'total_value',
      'Price and quantity are required to calculate total value'
    )
  }

  return record
}
