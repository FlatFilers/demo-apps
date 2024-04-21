import { FlatfileListener } from '@flatfile/listener';
import { plmProjectSpaceConfigure } from './workflows/plm/actions/plmProjectSpaceConfigure';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import { JSONExtractor } from '@flatfile/plugin-json-extractor';
import { externalConstraints } from './shared/externalContraints/externalConstraints';
import { externalConstraint } from '@flatfile/plugin-constraints';
import { validations } from './shared/validations/validations';
import { filefeedAutomap } from '@/shared/eventHandlers/filefeedAutomap';
import { handleSubmitData } from '@/shared/eventHandlers/handleSubmitData';
import { ProductsShowApiService } from '@/shared/products-show-api-service';
import { plmEmbeddedSpaceConfigure } from './workflows/plm/actions/plmEmbeddedSpaceConfigure';
import { plmFileFeedSpaceConfigure } from './workflows/plm/actions/plmFileFeedSpaceConfigure';
import { fieldServicesFilefeedSpaceConfigure } from '@/workflows/fieldServices/actions/fieldServicesFilefeed';
import { fieldServicesProjectSpaceConfigure } from '@/workflows/fieldServices/actions/fieldServicesProjects';
import { fieldServicesEmbedSpaceConfigure } from '@/workflows/fieldServices/actions/fieldServicesEmbed';
import { FieldServicesShowApiService } from '@/shared/field-services-show-api-service';

function configureSharedUses(listener: FlatfileListener) {
  listener.use(ExcelExtractor());
  listener.use(JSONExtractor());
  listener.use(handleSubmitData());

  // Apply external constraints
  Object.entries(externalConstraints).forEach(
    ([constraintName, constraint]) => {
      listener.use(externalConstraint(constraintName, constraint.validator));
    }
  );

  // Apply Bulk Record Hook Validations
  listener.use(validations);
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
    listener.use(plmProjectSpaceConfigure);
    configureSharedUses(listener);
  });

  listener.namespace('space:plmembedded', (listener) => {
    listener.use(plmEmbeddedSpaceConfigure);
    configureSharedUses(listener);
  });

  listener.namespace('space:plmfilefeed', (listener) => {
    listener.use(plmFileFeedSpaceConfigure);
    configureSharedUses(listener);

    listener.use(
      filefeedAutomap({
        apiService: ProductsShowApiService,
        matchFilename: /^products-sample-data.*$/i,
      })
    );

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
  });

  // Note: This listener is running in-browser in the plm.show app.
  // listener.namespace('space:plmdynamic', (listener) => {
  // });

  listener.namespace('space:services-project', (listener) => {
    listener.use(fieldServicesProjectSpaceConfigure);
    configureSharedUses(listener);
  });

  listener.namespace('space:services-embedded', (listener) => {
    listener.use(fieldServicesEmbedSpaceConfigure);
    configureSharedUses(listener);
  });

  listener.namespace('space:services-filefeed', (listener) => {
    listener.use(fieldServicesFilefeedSpaceConfigure);
    configureSharedUses(listener);

    listener.use(
      filefeedAutomap({
        apiService: FieldServicesShowApiService,
        // TODO: Update file name
        matchFilename: /^products-sample-data.*$/i,
      })
    );

    listener.on('**', (event) => {
      // Send certain filefeed events to products.show
      if (
        event.topic.includes('records:') ||
        (event.topic === 'job:completed' &&
          event?.payload?.status === 'complete')
      ) {
        FieldServicesShowApiService.sendFilefeedEvent(event);
      }
    });
  });

  // Note: This listener is running in-browser in the fieldservice.show app.
  // listener.namespace('space:services-dynamic', (listener) => {
  // });

  // Add more namespace configurations as needed)
}
