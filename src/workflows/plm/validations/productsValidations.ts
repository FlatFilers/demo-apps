/**
 * A module for handling currency validations and conversions in records processed by Flatfile.
 */

import { ProductsShowApiService } from '@/shared/products-show-api-service'
import { FlatfileRecord } from '@flatfile/hooks'
import { FlatfileEvent } from '@flatfile/listener'

// Field names used in FlatfileRecord for accessing and setting record data.
const FIELDS = {
  currency: 'currency',
  price: 'price',
  quantity: 'quantity',
  totalValue: 'total_value',
  totalValueUsd: 'total_value_usd',
}

/**
 * Parses a string to a number if possible, returning undefined for invalid inputs.
 * This utility function helps in safely converting numeric fields from string format,
 * ensuring that invalid or non-numeric inputs are handled gracefully.
 *
 * @param {string | undefined} value - The string value to parse into a number.
 * @returns {number | undefined} - The parsed number, or undefined if the input is invalid.
 */
const parseNumericField = (value: string | undefined): number | undefined => {
  const parsed = value ? parseFloat(value) : undefined
  return !isNaN(parsed) ? parsed : undefined
}

/**
 * Validates and calculates the total value of a record based on its price and quantity.
 * The total value is calculated as the product of price and quantity, and the result is
 * stored back in the record.
 *
 * @param {FlatfileRecord} record - The record whose total value is to be calculated.
 * @returns {FlatfileRecord} - The updated record with the total value set.
 */
export function validateTotalValue(record: FlatfileRecord): FlatfileRecord {
  const price = parseNumericField(record.get(FIELDS.price) as string)
  const quantity = parseNumericField(record.get(FIELDS.quantity) as string)

  if (price !== undefined && quantity !== undefined) {
    const totalValue = price * quantity
    const formattedTotalValue = (
      Math.round(totalValue * 100) / 100
    ).toFixed(2)
    record.set(FIELDS.totalValue, formattedTotalValue)
    if (parseFloat(formattedTotalValue) !== totalValue) {
      record.addInfo(
        FIELDS.totalValue,
        `The total value has been rounded to two decimal places. Original value: ${totalValue}`
      )
    }
  }

  return record
}

/**
 * Calculates and sets the total value in USD for a given record, using the provided exchange rates.
 * If the record's currency is not found in the provided rates, a warning is logged and no conversion
 * is performed. This function supports dynamically fetched exchange rates, allowing for accurate
 * currency conversions based on current financial data.
 *
 * @param {FlatfileRecord} record - The record to update with its USD value.
 * @param {Record<string, number>} rates - An object mapping currency codes to their exchange rates relative to USD.
 * @returns {FlatfileRecord} - The updated record with its total value in USD set, if applicable.
 */
export function calculateTotalValueUSD(
  record: FlatfileRecord,
  rates: Record<string, number>
): FlatfileRecord {
  const totalValue = record.get(FIELDS.totalValue) as number | undefined
  const inputCurrency = record.get(FIELDS.currency) as string | undefined
  let currency = inputCurrency
  // add support for common currency symbols
  switch (inputCurrency) {
    case "$":
      currency = "USD"
      break
    case "£":
      currency = "GBP"
      break
    case "€":
      currency = "EUR"
      break
    case "¥":
      currency = "JPY"
      break
  }

  if (totalValue !== undefined && currency && rates[currency]) {
    const exchangeRate = rates[currency] // Retrieve the exchange rate for the record's currency.
    const totalValueUSD = totalValue * exchangeRate // Convert the total value to USD.
    const formattedTotalValueUSD = (
      Math.round(totalValueUSD * 100) / 100
    ).toFixed(2)

    record.set(FIELDS.totalValueUsd, parseFloat(formattedTotalValueUSD))

    if (parseFloat(formattedTotalValueUSD) !== totalValueUSD) {
      record.addInfo(
        FIELDS.totalValueUsd,
        `The total value in USD has been rounded to two decimal places. Original value: ${totalValueUSD}`
      )
    }
  } else if (!rates[currency]) {
    console.warn(`No exchange rate available for currency: ${currency}`)
    // Additional handling could be implemented here for records without a valid conversion rate.
  }

  return record
}

export async function checkApiForExistingProducts(
  records: FlatfileRecord[],
  event: FlatfileEvent,
): Promise<FlatfileRecord> {
  const products = await ProductsShowApiService.fetchProducts(event);

  if (!products) {
    console.log('Failed to fetch products data from the API');
    return;
  }

  records.map((record: FlatfileRecord) => {
    try {
      // Get the current value of the product_id field
      let productId = record.get('product_id');
      console.log('product_id:', productId); // Log the current value of product_id

      // Check if the product_id matches an id from the API data
      const matchingProduct = products.find((product) => {
        return String(product.externalProductId) === String(productId); // Convert both to strings for comparison
      });

      // If a match is found, add an error to the product_id field
      if (matchingProduct) {
        console.log('Match found, adding error to product_id field');
        record.addError(
          'product_id',
          'Product ID matches an existing ID in PLM application.'
        );
      }
    } catch (error) {
      console.log('Error occurred during API check:', error); // Log any errors that occurred during the check
      // If an error occurred during the check, add an error to the product_id field
      record.addError('product_id', "Couldn't process data from the API.");
    }

    return record;
  });
}
