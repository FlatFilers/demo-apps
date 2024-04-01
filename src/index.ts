import { FlatfileListener } from '@flatfile/listener'
<<<<<<< Updated upstream
import { plmProjectSpaceConfigure } from './actions/plmProjectSpaceConfigure'
import { ecommerceProjectSpaceConfigure } from './actions/ecommerceProjectSpaceConfigure'
import { fieldServicesProjectSpaceConfigure } from './actions/fieldServicesProjects'
=======
import { plmProjectSpaceConfigure } from './workflows/plm/actions/plmProjectSpaceConfigure'
import { fieldServicesProjectSpaceConfigure } from './workflows/fieldServices/actions/fieldServicesProjects'
>>>>>>> Stashed changes
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor'
import { JSONExtractor } from '@flatfile/plugin-json-extractor'
import { externalConstraints } from './externalContraints/externalConstraints'
import { externalConstraint } from '@flatfile/plugin-constraints'
import { validations } from './shared/validations/validations'

const namespaceConfigs = {
  'space:plmproject': plmProjectSpaceConfigure,
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
  // Apply Bulk Record Hook Validations
  listener.use(validations)
}

export default function (listener: FlatfileListener) {
  listener.on('**', (event) => {
    console.log(
      `-> My event listener received an event: 
      ${JSON.stringify(event.topic)}
      ${JSON.stringify(event.namespace)} 
      ${JSON.stringify(event.payload)}`
    )
  })

  // Configure each namespace explicitly
  listener.namespace('space:plmproject', (listener) => {
    configureNamespace(listener, 'space:plmproject')
  })

  listener.namespace('space:servicesproject', (listener) => {
    configureNamespace(listener, 'space:servicesproject')
  })

  // Add more namespace configurations as needed)
}
