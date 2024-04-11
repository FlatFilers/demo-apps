/**
 * Integrates with Flatfile's import process to validate and convert monetary values
 * to USD for records within the 'products' sheet. This function sets up a bulk record
 * hook to process records in batches, leveraging the FreeCurrencyAPI to fetch current
 * exchange rates for accurate currency conversion.
 *
 * The API key is retrieved securely from the Flatfile environment secrets using the
 * event.secrets() method, ensuring sensitive information is not exposed in the codebase.
 * If the API key is unavailable or cannot be located, the code falls back to using default
 * exchange rates or skips currency conversion altogether.
 */
import { bulkRecordHook } from "@flatfile/plugin-record-hook";
import { FlatfileListener } from "@flatfile/listener";
import {
  validateTotalValue,
  calculateTotalValueUSD,
} from "../validations/productsValidations";
import FreeCurrencyAPI from "@everapi/freecurrencyapi-js";

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
      "products",
      async (records, event) => {
        let freeCurrencyAPI;
        try {
          // Retrieves the API key securely from the Flatfile environment secrets
          const apiKey = await event.secrets("FREECURRENCY_API_KEY");
          freeCurrencyAPI = new FreeCurrencyAPI(apiKey);
        } catch (error) {
          console.error("Error retrieving API key:", error);
          // Fallback to using default exchange rates or skip currency conversion
          return records.map((record) => {
            validateTotalValue(record);
            return record;
          });
        }

        let exchangeRates = {};
        try {
          // Fetches the latest exchange rates with USD as the base currency
          // This fetches rates for all available currencies by default
          const response = await freeCurrencyAPI.latest({
            base_currency: "USD",
          });
          exchangeRates = response.data; // Assuming 'data' contains the rates
          console.log("Fetched exchange rates:", exchangeRates);
        } catch (error) {
          console.error("Error fetching exchange rates:", error);
          // Fallback to using default exchange rates
          exchangeRates = {
            USD: 1,
            // Add default exchange rates for other currencies if available
          };
        }

        // Processes each record, applying validations and currency conversions using the fetched rates
        return records.map((record) => {
          validateTotalValue(record); // Validates the total value based on price and quantity
          calculateTotalValueUSD(record, exchangeRates); // Converts and sets the total value in USD
          return record; // Returns the updated record
        });
      },
      {
        chunkSize: 100, // Defines the number of records to process in each batch
        parallel: 2, // Specifies the number of batches to process in parallel
      }
    )
  );
}
