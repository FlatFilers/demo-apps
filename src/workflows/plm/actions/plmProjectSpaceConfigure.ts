import { configureSpace } from '@flatfile/plugin-space-configure';
import * as plmBlueprints from '../blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';

export const WORKBOOK_NAME = 'PLM Import';

export function plmProjectSpaceConfigure(listener: FlatfileListener) {
  listener.use(
    configureSpace({
      space: {
        metadata: {
          theme: {
            // add theme here
          },
        },
      },
      workbooks: [
        {
          name: WORKBOOK_NAME,
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
    })
  );
}
