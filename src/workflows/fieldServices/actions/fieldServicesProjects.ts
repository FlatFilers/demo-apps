import { configureSpace } from '@flatfile/plugin-space-configure'
import * as fieldServicesBlueprints from '../blueprints/_index'
import { FlatfileListener } from '@flatfile/listener'

export function fieldServicesProjectSpaceConfigure(listener: FlatfileListener) {
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
          name: 'Field Services Import',
          namespace: 'fieldServicesImport',
          sheets: [
            fieldServicesBlueprints.workOrders,
            fieldServicesBlueprints.customers,
            fieldServicesBlueprints.technicians,
            fieldServicesBlueprints.inventory,
            fieldServicesBlueprints.serviceContracts,
            fieldServicesBlueprints.suppliers,
            fieldServicesBlueprints.schedules,
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
