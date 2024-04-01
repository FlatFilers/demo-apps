// plmValidations.ts
import { FlatfileRecord } from '@flatfile/hooks'

const exchangeRates = {
  USD: 1.0,
  EUR: 0.91,
  GBP: 0.8,
  JPY: 139.8,
  CAD: 1.34,
  AUD: 1.49,
  CHF: 0.89,
  CNY: 7.12,
  HKD: 7.85,
  SGD: 1.34,
}

export function validateTotalValue(record: FlatfileRecord) {
  const price = record.get('price') as number
  const quantity = record.get('quantity') as number

  if (price === undefined || quantity === undefined) {
    if (price === undefined) {
      console.log('Price is required to calculate total value')
      record.addError('price', 'Price is required to calculate total value')
    }

    if (quantity === undefined) {
      console.log('Quantity is required to calculate total value')
      record.addError(
        'quantity',
        'Quantity is required to calculate total value'
      )
    }
  } else {
    const totalValue = price * quantity
    record.set('total_value', totalValue)
  }

  return record
}

export function calculateTotalValueUSD(record: FlatfileRecord) {
  const totalValue = record.get('total_value') as number
  const currency = record.get('currency') as string

  console.log('Total Value:', totalValue)
  console.log('Currency:', currency)

  if (totalValue !== undefined && currency !== undefined) {
    console.log('Total Value and Currency are defined')

    if (exchangeRates[currency]) {
      console.log('Exchange Rate found for Currency:', currency)
      console.log('Exchange Rate:', exchangeRates[currency])

      const totalValueUSD = totalValue / exchangeRates[currency]
      console.log('Calculated Total Value USD:', totalValueUSD)

      record.set('total_value_usd', totalValueUSD)
    } else {
      console.log('Invalid Currency:', currency)
      record.addError('currency', 'Invalid currency')
    }
  } else {
    console.log('Total Value or Currency is undefined')

    if (totalValue === undefined) {
      console.log('Total Value is undefined')
    }

    if (currency === undefined) {
      console.log('Currency is undefined')
    }
  }

  return record
}
