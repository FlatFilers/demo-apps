import { FlatfileListener } from '@flatfile/listener'
import { plmProjectSpaceConfigure } from './actions/plmProjectSpaceConfigure'
import { ecommerceProjectSpaceConfigure } from './actions/ecommerceProjectSpaceConfigure'
import { fieldServicesProjectSpaceConfigure } from './actions/fieldServicesProjects'
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor'
import { JSONExtractor } from '@flatfile/plugin-json-extractor'
import { externalConstraints } from './externalContraints/externalConstraints'
import { externalConstraint } from '@flatfile/plugin-constraints'

const namespaceConfigs = {
  'space:plmproject': plmProjectSpaceConfigure,
  'space:ecommerceproject': ecommerceProjectSpaceConfigure,
  'space:servicesproject': fieldServicesProjectSpaceConfigure,
  // Add more namespace configurations as needed
}

function configureNamespace(listener: FlatfileListener, namespace: string) {
  const spaceConfigureFunction = namespaceConfigs[namespace]
  if (spaceConfigureFunction) {
    listener.use(spaceConfigureFunction)
    listener.use(ExcelExtractor())
    listener.use(JSONExtractor())

    // Apply external constraints
    Object.entries(externalConstraints).forEach(
      ([constraintName, constraint]) => {
        listener.use(externalConstraint(constraintName, constraint.validator))
      }
    )
  } else {
    console.warn(`No configuration found for namespace: ${namespace}`)
  }
}

export default function (listener: FlatfileListener) {
  listener.on('**', (event) => {
    console.log(
      `-> My event listener received an event: ${JSON.stringify(event)}`
    )
  })

  Object.keys(namespaceConfigs).forEach((namespace) => {
    listener.namespace(namespace, (listener) => {
      configureNamespace(listener, namespace)
    })
  })
}
