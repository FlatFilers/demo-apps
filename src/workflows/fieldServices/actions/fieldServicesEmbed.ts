import { configureSpace } from '@flatfile/plugin-space-configure';
import * as fieldServicesBlueprints from '../blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import { embeddedSpaceTheme } from '@/workflows/themes/embedded-space-theme';
import { embeddedSpaceDocument } from '@/workflows/fieldServices/documents/embedded-space-document';
import { FIELD_SERVICE_WORKBOOK_NAME } from '@/shared/constants';

export function fieldServicesEmbedSpaceConfigure(listener: FlatfileListener) {
  listener.use(
    configureSpace(
      {
        documents: [embeddedSpaceDocument],
        workbooks: [
          {
            name: FIELD_SERVICE_WORKBOOK_NAME,
            namespace: 'fieldServicesImport',
            sheets: [
              fieldServicesBlueprints.workOrders,
              fieldServicesBlueprints.customers,
              fieldServicesBlueprints.technicians,
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
            theme: embeddedSpaceTheme,
          },
        });
      }
    )
  );
}
