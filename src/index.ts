import { filefeedAutomap } from '@/shared/eventHandlers/filefeedAutomap';
import { handleSubmitData } from '@/shared/eventHandlers/handleSubmitData';
import { externalConstraints } from '@/shared/externalContraints/externalConstraints';
import { ProductsShowApiService } from '@/shared/products-show-api-service';
import { ecommerceProjectSpaceConfigure } from '@/workflows/ecommerce/actions/ecommerceProjectSpaceConfigure';
import { fieldServicesProjectSpaceConfigure } from '@/workflows/fieldServices/actions/fieldServicesProjects';
import { plmProjectSpaceConfigure } from '@/workflows/plm/actions/plmProjectSpaceConfigure';
import FlatfileListener from '@flatfile/listener';
import { externalConstraint } from '@flatfile/plugin-constraints';
import { JSONExtractor } from '@flatfile/plugin-json-extractor';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import api from '@flatfile/api';
import { RecordHook } from '@flatfile/plugin-record-hook';
import { productValidations } from '@/workflows/plm/recordHooks/products/productValidations';

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

    listener.use(filefeedAutomap());

    listener.on('**', (event) => {
      // Send certain filefeed events to products.show
      if (
        event.topic.includes('records:') ||
        (event.topic === 'job:completed' &&
          event?.payload?.status === 'complete')
      ) {
        ProductsShowApiService.sendFilefeedEvent(event);
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

    // Products hook to check for existing products
    listener.on('commit:created', async (event) => {
      try {
        console.log('commit:created event triggered'); // Log when the event is triggered

        // Retrieve the sheetId from the event context
        const sheetId = event.context.sheetId;
        console.log(`Retrieved sheetId from event: ${sheetId}`); // Log the retrieved sheetId

        // Fetch the sheet from the API
        const sheet = await api.sheets.get(sheetId);

        // Only log that the sheet was fetched successfully
        if (!sheet) {
          console.log(`Failed to fetch sheet with id: ${sheetId}`);
          return;
        }
        console.log(`Sheet with id: ${sheetId} fetched successfully.`);

        // Verify that the sheetSlug matches 'products'
        if (sheet.data.config?.slug === 'products') {
          console.log("Confirmed: sheetSlug matches 'products'.");

          // Call the API endpoint at plm.show to get a list of products
          const products = await ProductsShowApiService.fetchProducts(event);

          console.log('Finished calling API endpoint. Processing response...');

          if (!products) {
            console.log('Failed to fetch products data from the API');
            return;
          }

          // If the list of products is empty, skip the RecordHook call
          if (products.length === 0) {
            console.log(
              'List of products from API is empty. Skipping RecordHook.'
            );
            return;
          }

          console.log(`Successfully fetched ${products.length} products.`);

          // Call the RecordHook function with event and a handler
          await RecordHook(event, async (record, _event) => {
            console.log('Inside RecordHook'); // Log inside the handler function

            try {
              // Pass the fetched products to the productValidations function along with the record
              await productValidations(record, products);
            } catch (error) {
              // Handle errors that might occur within productValidations
              console.error('Error in productValidations:', error);
            }

            return record;
          });

          console.log('Finished calling RecordHook');
        } else {
          console.log(
            "Failed: sheetSlug does not match 'products'. Aborting RecordHook call..."
          );
        }
      } catch (error) {
        console.error('Error in commit:created event handler:', error);
      }
    });
  });

  listener.namespace('space:ecommerceproject', (listener) => {
    configureNamespace(listener, 'space:ecommerceproject');
  });

  listener.namespace('space:servicesproject', (listener) => {
    configureNamespace(listener, 'space:servicesproject');
  });

  // Add more namespace configurations as needed)
}
