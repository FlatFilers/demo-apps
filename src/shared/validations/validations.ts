// validations.ts
import { bulkRecordHook } from '@flatfile/plugin-record-hook'
import { FlatfileListener } from '@flatfile/listener'
import {
  validateTotalValue,
  calculateTotalValueUSD,
} from '../../workflows/plm/validations/plmValidations'

/**
 * Configures validations for the Flatfile listener.
 * @param listener The FlatfileListener object.
 */
export function validations(listener: FlatfileListener) {
  // Use the bulkRecordHook to process records in bulk
  listener.use(
    bulkRecordHook(
      'products', // The sheet name or identifier
      (records) => {
        // Map over each record in the batch
        return records.map((record) => {
          // Validate and calculate the total value for the record
          validateTotalValue(record)
          // Calculate the total value in USD for the record
          calculateTotalValueUSD(record)
          // Return the updated record
          return record
        })
      },
      {
        chunkSize: 100, // Process records in chunks of 100
        parallel: 2, // Process 2 chunks in parallel
      }
    )
  )
}
