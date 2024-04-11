import { configureSpace } from '@flatfile/plugin-space-configure';
import * as plmBlueprints from '../blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import { WorkbookResponse } from '@flatfile/api/api';
import { attributes as attributesBlueprint } from '../blueprints/_index';
import { ProductsShowApiService } from '../../../shared/products-show-api-service';
import { modifySheet } from '../../../shared/helpers/modifySheet';

const WORKBOOK_NAME = 'PLM Import';
const modifiedProducts = modifySheet(plmBlueprints.products);

export function plmEmbeddedSpaceConfigure(listener: FlatfileListener) {
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
