import { configureSpace } from '@flatfile/plugin-space-configure';
import * as fieldServicesBlueprints from '../blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import { projectSpaceTheme } from '@/workflows/plm/themes/project-space-theme';
import { projectSpaceDocument } from '@/workflows/plm/documents/project-space-document';
import { WorkbookResponse } from '@flatfile/api/api';
import { FieldServicesShowApiService } from '@/shared/field-services-show-api-service';

const WORKBOOK_NAME = 'Field Services Import';

export function fieldServicesProjectSpaceConfigure(listener: FlatfileListener) {
  listener.use(
    configureSpace(
      {
        documents: [projectSpaceDocument],
        workbooks: [
          {
            name: WORKBOOK_NAME,
            namespace: 'fieldServicesImport',
            sheets: [
              fieldServicesBlueprints.workOrders,
              fieldServicesBlueprints.customers,
              fieldServicesBlueprints.technicians,
              fieldServicesBlueprints.inventory,
              fieldServicesBlueprints.serviceContracts,
              fieldServicesBlueprints.suppliers,
              fieldServicesBlueprints.schedules,
            ],
            actions: [
              {
                operation: 'submitAction',
                mode: 'foreground',
                constraints: [{ type: 'hasData' }],
                label: 'Submit Data',
                primary: true,
              },
            ],
          },
        ],
      },
      async (event) => {
        const { spaceId } = event.context;
        const documents = await api.documents.list(spaceId);

        // Get the first documentId
        const documentId =
          documents.data.length > 0 ? documents.data[0]['id'] : null;

        // Update the space adding theme and setting the documentId as the default page
        await api.spaces.update(spaceId, {
          metadata: {
            sidebarConfig: {
              showSidebar: true,
              defaultPage: {
                documentId,
              },
            },
            theme: projectSpaceTheme,
          },
        });
      }
    )
  );

  // Seed the workbook with data
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

    if (workbookName === WORKBOOK_NAME) {
      const sheets = workbook?.data?.sheets ? workbook.data.sheets : [];

      const techniciansSheet = sheets.find(
        (s) => s.config.slug === fieldServicesBlueprints.technicians.slug
      );

      console.log('Fetching attributes from products.show...');

      // Fetch attributes from products.show API
      const technicians = await FieldServicesShowApiService.fetchTechnicians(
        event
      );

      if (techniciansSheet && technicians && technicians.length > 0) {
        const mappedTechnicians = technicians.map((t) => {
          return {
            technician_id: { value: t.externalTechnicianId },
            name: { value: t.name },
            email: { value: t.email },
            phone_number: { value: t.phoneNumber },
            skills: { value: t.skills },
            availability: { value: t.availability },
            license_certification: { value: t.licenseCertification },
            notes: { value: t.notes },
          };
        });

        try {
          await api.records.insert(techniciansSheet.id, mappedTechnicians);
        } catch (error) {
          console.error('Error inserting technicians:', error.message);
        }
      }
    } else {
      console.error('Error - no workbook found');
    }
  });
}
