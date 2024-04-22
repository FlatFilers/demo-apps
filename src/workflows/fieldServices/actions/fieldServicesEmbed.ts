import { configureSpace } from '@flatfile/plugin-space-configure';
import * as fieldServicesBlueprints from '../blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';
import { modifySheet } from '@/shared/helpers/modifySheet';
import api from '@flatfile/api';
import { embeddedSpaceTheme } from '@/workflows/plm/themes/embedded-space-theme';
import { embeddedSpaceDocument } from '@/workflows/plm/documents/embedded-space-document';

const modifiedCustomers = modifySheet(fieldServicesBlueprints.customers);

export function fieldServicesEmbedSpaceConfigure(listener: FlatfileListener) {
  listener.use(
    configureSpace(
      {
        documents: [embeddedSpaceDocument],
        workbooks: [
          {
            name: 'Field Services Import',
            namespace: 'fieldServicesImport',
            sheets: [modifiedCustomers],
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