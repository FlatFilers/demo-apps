import { filefeedAutomap } from '../src/shared/eventHandlers/filefeedAutomap';
import { handleSubmitData } from '../src/shared/eventHandlers/handleSubmitData';
import { externalConstraints } from '../src/shared/externalContraints/externalConstraints';
import { ecommerceProjectSpaceConfigure } from '../src/workflows/ecommerce/actions/ecommerceProjectSpaceConfigure';
import { fieldServicesProjectSpaceConfigure } from '../src/workflows/fieldServices/actions/fieldServicesProjects';
import { plmProjectSpaceConfigure } from '../src/workflows/plm/actions/plmProjectSpaceConfigure';
import FlatfileListener from '@flatfile/listener';
import { externalConstraint } from '@flatfile/plugin-constraints';
import { JSONExtractor } from '@flatfile/plugin-json-extractor';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';

const namespaceConfigs = {
  'space:plmproject': plmProjectSpaceConfigure,
  'space:ecommerceproject': ecommerceProjectSpaceConfigure,
  'space:servicesproject': fieldServicesProjectSpaceConfigure,
  // Add more namespace configurations as needed
};

function configureNamespace(listener: FlatfileListener, namespace: string) {
  const spaceConfigureFunction = namespaceConfigs[namespace];
  if (spaceConfigureFunction) {
    listener.use(spaceConfigureFunction);
    listener.use(ExcelExtractor());
    listener.use(JSONExtractor());
    listener.use(handleSubmitData());

    // Apply external constraints
    Object.entries(externalConstraints).forEach(
      ([constraintName, constraint]) => {
        listener.use(externalConstraint(constraintName, constraint.validator));
      }
    );
  } else {
    console.warn(`No configuration found for namespace: ${namespace}`);
  }
}

export default function (listener: FlatfileListener) {
  listener.on('**', (event) => {
    console.log(
      `[${JSON.stringify(event.topic)}]
      ${JSON.stringify(event.namespace)} 
      ${JSON.stringify(event.payload)}`
    );
  });

  // Configure each namespace explicitly
  listener.namespace('space:plmproject', (listener) => {
    configureNamespace(listener, 'space:plmproject');
  });

  listener.namespace('space:ecommerceproject', (listener) => {
    configureNamespace(listener, 'space:ecommerceproject');
  });

  listener.namespace('space:servicesproject', (listener) => {
    configureNamespace(listener, 'space:servicesproject');
    listener.use(filefeedAutomap());
  });

  // Add more namespace configurations as needed)
}
