import { bulkRecordHook } from '@flatfile/plugin-record-hook';
import { FlatfileListener } from '@flatfile/listener';
import { checkApiForExistingEmployees } from '@/workflows/hcm/validations/employeeValidations';

export async function hcmValidations(listener: FlatfileListener) {
  listener.use(
    bulkRecordHook('employees-sheet', async (records, event) => {
      await checkApiForExistingEmployees(records, event); // Checks if the employee_id exists in the API data
    })
  );
}
