import { bulkRecordHook } from '@flatfile/plugin-record-hook';
import { FlatfileListener } from '@flatfile/listener';
import { employeeValidations } from '@/workflows/hcm/validations/employeeValidations';
import { jobValidations } from '@/workflows/hcm/validations/jobValidations';

export async function hcmValidations(listener: FlatfileListener) {
  listener.use(
    bulkRecordHook('employees-sheet', async (records, event) => {
      await employeeValidations(records, event);
    })
  );

  listener.use(
    bulkRecordHook('jobs-sheet', async (records) => {
      await jobValidations(records);
    })
  );
}
