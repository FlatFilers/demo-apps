import { FlatfileListener } from '@flatfile/listener';
import { plmProjectSpaceConfigure } from './workflows/plm/actions/plmProjectSpaceConfigure';
import { ecommerceProjectSpaceConfigure } from './workflows/ecommerce/actions/ecommerceProjectSpaceConfigure';
import { fieldServicesProjectSpaceConfigure } from './workflows/fieldServices/actions/fieldServicesProjects';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import { JSONExtractor } from '@flatfile/plugin-json-extractor';
import { externalConstraints } from './shared/externalContraints/externalConstraints';
import { externalConstraint } from '@flatfile/plugin-constraints';
import { handleSubmitData } from './shared/eventHandlers/handleSubmitData';
import { automap } from '@flatfile/plugin-automap';
import { WORK_ORDERS_SHEET_NAME } from './workflows/fieldServices/blueprints/workOrders';
import { PipelineJobConfig } from '@flatfile/api/api';
import api from '@flatfile/api';
import { ProductsShowApiService } from './shared/products-show-api-service';

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

    listener.use(
      automap({
        accuracy: 'confident',
        matchFilename: /^workorders.*$/i,
        defaultTargetSheet: WORK_ORDERS_SHEET_NAME,
      })
    );

    listener.on('job:completed', { job: 'workbook:map' }, async (event) => {
      // Get key identifiers, including destination sheet Id
      const { jobId } = event.context;

      const job = await api.jobs.get(jobId);
      const config = job.data.config as PipelineJobConfig;

      const destinationSheetId = config?.destinationSheetId;

      // Get the valid records from the sheet
      const importedData = await api.records.get(destinationSheetId, {
        filter: 'valid',
      });

      // Sync the space in plm.show
      console.log('Syncing spacde in plm.show');

      const result = await ProductsShowApiService.syncSpace(event);

      console.log('Result:', result);

      const syncedFlatfileRecordIds = result.syncedFlatfileRecordIds;

      console.log(
        syncedFlatfileRecordIds.length +
          ' successfully synced records from plm.show. '
      );

      // Delete the valid records from the sheet
      const recordIds = importedData.data.records.map((r) => r.id);
      console.log(
        'Deleting ' + syncedFlatfileRecordIds.length + ' valid records.'
      );

      // Split the recordIds array into chunks of 100
      const chunk = 100;
      for (let i = 0; i < recordIds.length; i += chunk) {
        const batch = recordIds
          .slice(i, i + chunk)
          // Delete the records that were successfully synced
          .filter((id) => syncedFlatfileRecordIds.includes(id));

        // Delete the batch
        await api.records.delete(destinationSheetId, {
          ids: batch,
        });

        console.log(`Deleted batch from index ${i} to ${i + chunk}`);
      }

      console.log('Done');
    });
  });

  // Add more namespace configurations as needed)
}
