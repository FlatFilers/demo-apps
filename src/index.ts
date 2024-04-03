import { FlatfileListener } from '@flatfile/listener';
import {
  plmProjectSpaceConfigure,
  WORKBOOK_NAME,
} from './workflows/plm/actions/plmProjectSpaceConfigure';
import { ecommerceProjectSpaceConfigure } from './workflows/ecommerce/actions/ecommerceProjectSpaceConfigure';
import { fieldServicesProjectSpaceConfigure } from './workflows/fieldServices/actions/fieldServicesProjects';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import { JSONExtractor } from '@flatfile/plugin-json-extractor';
import { externalConstraints } from './shared/externalContraints/externalConstraints';
import { externalConstraint } from '@flatfile/plugin-constraints';
import { handleSubmitData } from './shared/eventHandlers/handleSubmitData';
import api from '@flatfile/api';
import { attributes as attributesBlueprint } from './workflows/plm/blueprints/attributes';
import { ProductsShowApiService } from './shared/products-show-api-service';
import { WorkbookResponse } from '@flatfile/api/api';

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

    // Seed the workbook with data
    listener.on('workbook:created', async (event) => {
      if (!event.context || !event.context.workbookId) {
        console.error('Event context or workbookId missing');
        return;
      }

      const workbookId = event.context.workbookId;
      let workbook: WorkbookResponse;
      try {
        workbook = await api.workbooks.get(workbookId);
      } catch (error) {
        console.error('Error getting workbook:', error.message);
        throw error;
      }

      const workbookName = workbook?.data?.name ? workbook.data.name : '';

      if (workbookName === WORKBOOK_NAME) {
        const sheets = workbook?.data?.sheets ? workbook.data.sheets : [];

        const attributesSheet = sheets.find(
          (s) => s.config.slug === attributesBlueprint.slug
        );

        console.log('Fetching attributes from products.show...');

        // Fetch attributes from products.show API
        const attributes = await ProductsShowApiService.fetchAttributes(event);

        if (attributesSheet && attributes && attributes.length > 0) {
          const attributeSheetId = attributesSheet.id;

          const mappedAttributes = attributes.map(
            ({ externalId, name, value, unit }) => ({
              attribute_id: { value: externalId },
              name: { value: name },
              value: { value: value },
              unit: { value: unit },
            })
          );

          try {
            await api.records.insert(attributeSheetId, mappedAttributes);
          } catch (error) {
            console.error('Error inserting attributes:', error.message);
          }
        }
      } else {
        console.error('Error - no workbook found');
      }
    });

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
  });

  // Add more namespace configurations as needed)
}
