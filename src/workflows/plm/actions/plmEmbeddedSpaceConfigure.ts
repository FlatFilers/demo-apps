import { configureSpace } from '@flatfile/plugin-space-configure';
import * as plmBlueprints from '../blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';
import { modifySheet } from '../../../shared/helpers/modifySheet';
import { embeddedSpaceTheme } from '@/workflows/plm/themes/embedded-space-theme';
import api from '@flatfile/api';
import { embeddedSpaceDocument } from '@/workflows/plm/documents/embedded-space-document';

const WORKBOOK_NAME = 'PLM Import';
const modifiedProducts = modifySheet(plmBlueprints.products);

export function plmEmbeddedSpaceConfigure(listener: FlatfileListener) {
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
    const document = embeddedSpaceDocument;
    const theme = embeddedSpaceTheme;

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
