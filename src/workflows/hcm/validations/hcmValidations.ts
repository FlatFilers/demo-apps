import { bulkRecordHook } from '@flatfile/plugin-record-hook';
import { FlatfileListener } from '@flatfile/listener';
import { employeeValidations } from '@/workflows/hcm/validations/employeeValidations';

export async function hcmValidations(listener: FlatfileListener) {
  listener.use(
    bulkRecordHook('employees-sheet', async (records, event) => {
      await employeeValidations(records, event);
    })
  );
}
