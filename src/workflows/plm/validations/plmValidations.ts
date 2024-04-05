/**
 * Integrates with Flatfile's import process to validate and convert monetary values
 * to USD for records within the 'products' sheet. This function sets up a bulk record
 * hook to process records in batches, leveraging the FreeCurrencyAPI to fetch current
 * exchange rates for accurate currency conversion.
 *
 * IMPORTANT: The API key is hardcoded here for demonstration purposes. In a production environment,
 * it's crucial to store sensitive information such as API keys in environment variables or
 * a secure secrets management solution to prevent unauthorized access.
 */

import { bulkRecordHook } from '@flatfile/plugin-record-hook'
import { FlatfileListener } from '@flatfile/listener'
import {
  validateTotalValue,
  calculateTotalValueUSD,
} from '../validations/productsValidations'
import FreeCurrencyAPI from '@everapi/freecurrencyapi-js'
global.fetch = require('node-fetch') // Polyfills fetch in a Node.js environment for the FreeCurrencyAPI.

// Initialize the FreeCurrencyAPI client with an API key.
// Note: Replace the API key with a secure retrieval method for production use.
const freeCurrencyAPI = new FreeCurrencyAPI(
  'fca_live_a3JDy4PACw4C3CbgCf35ZZlwYQjLZgfUGmJNLgmm'
)

/**
 * Configures and applies validations and currency conversion to records processed by Flatfile.
 * This function is specifically designed for the 'products' sheet and utilizes the FreeCurrencyAPI
 * to fetch the latest exchange rates for currency conversion.
 *
 * @param {FlatfileListener} listener - The FlatfileListener instance to which the bulk record hook is attached.
 */
export async function plmValidations(listener: FlatfileListener) {
  listener.use(
    bulkRecordHook(
      'products',
      async (records) => {
        let exchangeRates = {}
        try {
          // Fetches the latest exchange rates with USD as the base currency.
          // This fetches rates for all available currencies by default.
          const response = await freeCurrencyAPI.latest({
            base_currency: 'USD',
          })
          exchangeRates = response.data // Assuming 'data' contains the rates.
          console.log('Fetched exchange rates:', exchangeRates)
        } catch (error) {
          console.error('Error fetching exchange rates:', error)
          // Error handling strategy could include aborting the operation or using fallback rates.
          return // Exits the function due to the error.
        }

        // Processes each record, applying validations and currency conversions using the fetched rates.
        return records.map((record) => {
          validateTotalValue(record) // Validates the total value based on price and quantity.
          calculateTotalValueUSD(record, exchangeRates) // Converts and sets the total value in USD.
          return record // Returns the updated record.
        })
      },
      {
        chunkSize: 100, // Defines the number of records to process in each batch.
        parallel: 2, // Specifies the number of batches to process in parallel.
      }
    )
  )
}
