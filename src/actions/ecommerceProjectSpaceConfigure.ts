import { configureSpace } from '@flatfile/plugin-space-configure'
import * as ecommerceBlueprints from '../blueprints/ecommerce/_index'
import { FlatfileListener } from '@flatfile/listener'

export function ecommerceProjectSpaceConfigure(listener: FlatfileListener) {
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
          name: 'Ecommerce Import',
          namespace: 'ecommerceImport',
          sheets: [
            ecommerceBlueprints.customers,
            ecommerceBlueprints.orders,
            ecommerceBlueprints.payments,
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
  )
}
