import { configureSpace } from '@flatfile/plugin-space-configure';
import * as plmBlueprints from '../blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';
import { modifySheet } from '../../../shared/helpers/modifySheet';
import { fileFeedSpaceTheme } from '@/workflows/plm/themes/file-feed-space-theme';
import { fileFeedSpaceDocument } from '@/workflows/plm/documents/file-feed-space-document';

const WORKBOOK_NAME = 'PLM Import';
const modifiedProducts = modifySheet(plmBlueprints.products);

export function plmFileFeedSpaceConfigure(listener: FlatfileListener) {
  listener.use(
    configureSpace({
      space: {
        metadata: {
          theme: fileFeedSpaceTheme,
        },
      },
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
    })
  );
}
