import { FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import { WorkbookResponse } from '@flatfile/api/api';
import { HcmShowApiService } from '@/shared/hcm-show-api-service';
import * as hcmBlueprints from '@/workflows/hcm/blueprints/_index';
import { HCM_WORKBOOK_NAME } from '@/shared/constants';

export const hcmPrefillData =
  () =>
  (listener: FlatfileListener): void => {
    // seed the workbook with data
    listener.on('workbook:created', async (event) => {
      if (!event.context || !event.context.workbookId) {
        console.error('Event context or workbookId missing');
        return;
      }

      const workbookId = event.context.workbookId;
      let workbook: WorkbookResponse;
      try {
        workbook = await api.workbooks.get(workbookId);
      } catch (error) {
        console.error('Error getting workbook:', error.message);
        throw error;
      }

      const workbookName = workbook?.data?.name ? workbook.data.name : '';

      if (workbookName !== HCM_WORKBOOK_NAME) {
        console.error('Error - no workbook found');
        return;
      }

      const sheets = workbook?.data?.sheets ? workbook.data.sheets : [];

      try {
        const departmentsSheet = sheets.find(
          (s) => s.config.slug === hcmBlueprints.departments.slug
        );

        console.log('Fetching departments from hcm.show...');

        // Fetch departments from hcm.show API
        const departments = await HcmShowApiService.fetchDepartments(event);

        if (departmentsSheet && departments && departments.length > 0) {
          const departmentsSheetId = departmentsSheet.id;

          const mappedDepartments = departments.map(
            ({ departmentCode, departmentName }) => ({
              departmentCode: { value: departmentCode },
              departmentName: { value: departmentName },
            })
          );

          await api.records.insert(departmentsSheetId, mappedDepartments);
        }
      } catch (error) {
        console.error('Error fetching departments:', error.message);
        throw error;
      }

      console.log('Prefill data complete');
    });
  };
