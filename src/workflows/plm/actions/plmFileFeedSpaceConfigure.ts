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
    configureSpace({
      space: {},
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
    })
  );

  // Create document and set theme for the space
  listener.on('space:created', async ({ context: { spaceId } }) => {
    const document = fileFeedSpaceDocument;
    const theme = fileFeedSpaceTheme;

    let createDocument;
    try {
      createDocument = await api.documents.create(spaceId, document);
    } catch (error) {
      console.error('Error creating document:', error.message);
      throw error;
    }

    try {
      await api.spaces.update(spaceId, {
        metadata: {
          sidebarConfig: {
            showSidebar: true,
            defaultPage: {
              documentId: createDocument.data.id,
            },
          },
          theme,
        },
      });
    } catch (error) {
      console.error('Error updating space:', error.message);
      throw error;
    }
  });
}
