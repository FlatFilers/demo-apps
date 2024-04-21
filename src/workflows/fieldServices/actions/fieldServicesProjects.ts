import { configureSpace } from '@flatfile/plugin-space-configure';
import * as fieldServicesBlueprints from '../blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import { projectSpaceTheme } from '@/workflows/plm/themes/project-space-theme';
import { projectSpaceDocument } from '@/workflows/plm/documents/project-space-document';

export function fieldServicesProjectSpaceConfigure(listener: FlatfileListener) {
  listener.use(
    configureSpace(
      {
        documents: [projectSpaceDocument],
        workbooks: [
          {
            name: 'Field Services Import',
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
}
