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
import { ApiService } from '@/shared/api-service-base';
import { plmPrefillData } from '@/shared/eventHandlers/plmPrefillData';
import { fieldServicePrefillData } from '@/shared/eventHandlers/fieldServicePrefillData';
import { PRODUCTS_SHEET_NAME } from '@/workflows/plm/blueprints/products';
import { CUSTOMERS_SHEET_NAME } from '@/workflows/fieldServices/blueprints/customers';
import { hcmProjectSpaceConfigure } from './workflows/hcm/actions/hcmProjectSpaceConfigure';
import { hcmPrefillData } from '@/shared/eventHandlers/hcmPrefillData';
import { HcmShowApiService } from '@/shared/hcm-show-api-service';
import { hcmEmbeddedSpaceConfigure } from '@/workflows/hcm/actions/hcmEmbeddedSpaceConfigure';
import { hcmFileFeedSpaceConfigure } from '@/workflows/hcm/actions/hcmFileFeedSpaceConfigure';

function configureSharedUses({
  listener,
  apiService,
}: {
  listener: FlatfileListener;
  apiService: ApiService;
}) {
  listener.use(ExcelExtractor());
  listener.use(JSONExtractor());
  listener.use(handleSubmitData({ apiService }));

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
    listener.use(plmPrefillData());
    configureSharedUses({ listener, apiService: ProductsShowApiService });
  });

  listener.namespace('space:plmembedded', (listener) => {
    listener.use(plmEmbeddedSpaceConfigure);
    listener.use(plmPrefillData());
    configureSharedUses({ listener, apiService: ProductsShowApiService });
  });

  listener.namespace('space:plmfilefeed', (listener) => {
    listener.use(plmFileFeedSpaceConfigure);
    configureSharedUses({ listener, apiService: ProductsShowApiService });

    listener.use(
      filefeedAutomap({
        apiService: ProductsShowApiService,
        matchFilename: /^products-sample-data.*$/i,
        defaultTargetSheet: PRODUCTS_SHEET_NAME,
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
    listener.use(fieldServicePrefillData());
    configureSharedUses({ listener, apiService: FieldServicesShowApiService });
  });

  listener.namespace('space:services-embedded', (listener) => {
    listener.use(fieldServicesEmbedSpaceConfigure);
    listener.use(fieldServicePrefillData());
    configureSharedUses({ listener, apiService: FieldServicesShowApiService });
  });

  listener.namespace('space:services-filefeed', (listener) => {
    listener.use(fieldServicesFilefeedSpaceConfigure);
    configureSharedUses({ listener, apiService: FieldServicesShowApiService });

    listener.use(
      filefeedAutomap({
        apiService: FieldServicesShowApiService,
        matchFilename: /^customers-sample-data.*$/i,
        defaultTargetSheet: CUSTOMERS_SHEET_NAME,
      })
    );

    listener.on('**', (event) => {
      // Send certain filefeed events to service.show
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

  listener.namespace('space:hcmproject', (listener) => {
    listener.use(hcmProjectSpaceConfigure);
    listener.use(hcmPrefillData());
    configureSharedUses({ listener, apiService: HcmShowApiService });
  });

  listener.namespace('space:hcmembedded', (listener) => {
    listener.use(hcmEmbeddedSpaceConfigure);
    listener.use(hcmPrefillData());
    configureSharedUses({ listener, apiService: HcmShowApiService });
  });

  listener.namespace('space:hcmfilefeed', (listener) => {
    listener.use(hcmFileFeedSpaceConfigure);
    configureSharedUses({ listener, apiService: HcmShowApiService });

    listener.use(
      filefeedAutomap({
        apiService: HcmShowApiService,
        matchFilename: /^benefits.*$/i,
      })
    );

    listener.on('**', (event) => {
      // Send certain filefeed events to hcm.show
      if (
        event.topic.includes('records:') ||
        (event.topic === 'job:completed' &&
          event?.payload?.status === 'complete')
      ) {
        HcmShowApiService.sendFilefeedEvent(event);
      }
    });
  });

  // Add more namespace configurations as needed)
}
