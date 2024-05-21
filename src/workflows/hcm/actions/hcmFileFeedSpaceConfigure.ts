import { configureSpace } from '@flatfile/plugin-space-configure';
import * as hcmBlueprints from '../blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';
import { modifySheet } from '../../../shared/helpers/modifySheet';
import { fileFeedSpaceTheme } from '@/workflows/themes/file-feed-space-theme';
import { fileFeedSpaceDocument } from '@/workflows/hcm/documents/file-feed-space-document';
import api from '@flatfile/api';
import { HCM_WORKBOOK_NAME } from '@/shared/constants';

const modifiedBenefits = modifySheet(hcmBlueprints.benefits);

export function hcmFileFeedSpaceConfigure(listener: FlatfileListener) {
  listener.use(
    configureSpace(
      {
        documents: [fileFeedSpaceDocument],
        workbooks: [
          {
            name: HCM_WORKBOOK_NAME,
            namespace: 'hcmImport',
            sheets: [modifiedBenefits],
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
