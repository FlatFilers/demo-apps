// plmValidations.ts
import { FlatfileRecord } from '@flatfile/hooks'

// Exchange rates for various currencies
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

// Constants for field names
const CURRENCY_FIELD = 'currency'
const PRICE_FIELD = 'price'
const QUANTITY_FIELD = 'quantity'
const TOTAL_VALUE_FIELD = 'total_value'
const TOTAL_VALUE_USD_FIELD = 'total_value_usd'

/**
 * Validates and calculates the total value based on price and quantity.
 * @param record The FlatfileRecord object.
 * @returns The updated FlatfileRecord object with the total value set.
 */
export function validateTotalValue(record: FlatfileRecord): FlatfileRecord {
  // Get the price and quantity values as strings
  const priceString = record.get(PRICE_FIELD) as string | undefined
  const quantityString = record.get(QUANTITY_FIELD) as string | undefined

  // Convert the price and quantity strings to numbers
  const price = priceString ? parseFloat(priceString) : undefined
  const quantity = quantityString ? parseFloat(quantityString) : undefined

  // Check if price and quantity are valid numbers
  if (!isNaN(price) && !isNaN(quantity)) {
    // Calculate the total value
    const totalValue = price * quantity
    // Set the total value in the record
    record.set(TOTAL_VALUE_FIELD, totalValue)
  }

  return record
}

/**
 * Calculates the total value in USD based on the total value and currency.
 * @param record The FlatfileRecord object.
 * @returns The updated FlatfileRecord object with the total value in USD set.
 */
export function calculateTotalValueUSD(record: FlatfileRecord): FlatfileRecord {
  // Get the total value and currency from the record
  const totalValue = record.get(TOTAL_VALUE_FIELD) as number | undefined
  const currency = record.get(CURRENCY_FIELD) as string | undefined

  // Check if total value is a number and currency is a string
  if (typeof totalValue === 'number' && typeof currency === 'string') {
    // Get the exchange rate based on the currency
    const exchangeRate = exchangeRates[currency]

    // Check if the exchange rate exists
    if (exchangeRate) {
      // Calculate the total value in USD
      const totalValueUSD = exchangeRate !== 0 ? totalValue / exchangeRate : 0
      // Round the total value in USD to two decimal places
      const roundedTotalValueUSD = Math.round(totalValueUSD * 100) / 100
      // Format the rounded value to always have two decimal places
      const formattedTotalValueUSD = roundedTotalValueUSD.toFixed(2)
      // Set the formatted total value in USD in the record
      record.set(TOTAL_VALUE_USD_FIELD, parseFloat(formattedTotalValueUSD))

      // Check if the original total value in USD is different from the rounded value
      if (totalValueUSD !== roundedTotalValueUSD) {
        // Add an info message to the record indicating the rounding
        record.addInfo(
          TOTAL_VALUE_USD_FIELD,
          `The total value in USD has been rounded to two decimal places. Original value: ${totalValueUSD}`
        )
      }
    }
  }

  return record
}
