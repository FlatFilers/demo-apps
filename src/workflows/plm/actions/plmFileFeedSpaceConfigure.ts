import { configureSpace } from '@flatfile/plugin-space-configure';
import * as plmBlueprints from '../blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';
import { modifySheet } from '../../../shared/helpers/modifySheet';
import { fileFeedSpaceTheme } from '@/workflows/plm/themes/file-feed-space-theme';
import { fileFeedSpaceDocument } from '@/workflows/plm/documents/file-feed-space-document';
import api from '@flatfile/api';

const WORKBOOK_NAME = 'PLM Import';
const modifiedProducts = modifySheet(plmBlueprints.products);

export function plmFileFeedSpaceConfigure(listener: FlatfileListener) {
  listener.use(
    configureSpace(
      {
        documents: [fileFeedSpaceDocument],
        workbooks: [
          {
            name: WORKBOOK_NAME,
            namespace: 'plmImport',
            sheets: [modifiedProducts],
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
