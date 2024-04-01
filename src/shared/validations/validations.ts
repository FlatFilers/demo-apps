// validations.ts
import { bulkRecordHook } from '@flatfile/plugin-record-hook'
import { FlatfileListener } from '@flatfile/listener'
import {
  validateTotalValue,
  calculateTotalValueUSD,
} from '../../workflows/plm/validations/plmValidations'

export function validations(listener: FlatfileListener) {
  listener.use(
    bulkRecordHook(
      'products',
      (records) => {
        return records.map((record) => {
          validateTotalValue(record)
          calculateTotalValueUSD(record)
          return record
        })
      },
      { chunkSize: 100, parallel: 2 }
    )
  )
}
