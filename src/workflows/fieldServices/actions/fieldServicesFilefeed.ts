import { configureSpace } from '@flatfile/plugin-space-configure';
import * as fieldServicesBlueprints from '../blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';
import { modifySheet } from '@/shared/helpers/modifySheet';
import api from '@flatfile/api';
import { fileFeedSpaceTheme } from '@/workflows/plm/themes/file-feed-space-theme';
import { FIELD_SERVICE_WORKBOOK_NAME } from '@/shared/constants';

const modifiedCustomers = modifySheet(fieldServicesBlueprints.customers);

export function fieldServicesFilefeedSpaceConfigure(
  listener: FlatfileListener
) {
  listener.use(
    configureSpace(
      {
        workbooks: [
          {
            name: FIELD_SERVICE_WORKBOOK_NAME,
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
            theme: fileFeedSpaceTheme,
          },
        });
      }
    )
  );
}
