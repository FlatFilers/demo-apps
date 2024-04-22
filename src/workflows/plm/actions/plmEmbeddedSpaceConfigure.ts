import { configureSpace } from '@flatfile/plugin-space-configure';
import * as plmBlueprints from '../blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';
import { embeddedSpaceTheme } from '@/workflows/plm/themes/embedded-space-theme';
import { embeddedSpaceDocument } from '@/workflows/plm/documents/embedded-space-document';
import api from '@flatfile/api';
import { PLM_WORKBOOK_NAME } from '@/shared/constants';

export function plmEmbeddedSpaceConfigure(listener: FlatfileListener) {
  listener.use(
    configureSpace(
      {
        documents: [embeddedSpaceDocument],
        workbooks: [
          {
            name: PLM_WORKBOOK_NAME,
            namespace: 'plmImport',
            sheets: [
              plmBlueprints.attributes,
              plmBlueprints.suppliers,
              plmBlueprints.categories,
              plmBlueprints.products,
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
