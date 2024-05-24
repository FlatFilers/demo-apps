import { configureSpace } from '@flatfile/plugin-space-configure';
import * as hcmBlueprints from '@/workflows/hcm/blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';
import { embeddedSpaceTheme } from '@/workflows/themes/embedded-space-theme';
import { embeddedSpaceDocument } from '@/workflows/plm/documents/embedded-space-document';
import api from '@flatfile/api';
import { HCM_WORKBOOK_NAME } from '@/shared/constants';

export function hcmEmbeddedSpaceConfigure(listener: FlatfileListener) {
  listener.use(
    configureSpace(
      {
        documents: [embeddedSpaceDocument],
        workbooks: [
          {
            name: HCM_WORKBOOK_NAME,
            namespace: 'hcmImport',
            sheets: [hcmBlueprints.benefits],
            actions: [
              {
                operation: 'submitAction',
                mode: 'foreground',
                constraints: [{ type: 'hasData' }],
                label: 'Push records to HCM.show',
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
