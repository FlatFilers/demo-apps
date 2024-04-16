import { configureSpace } from '@flatfile/plugin-space-configure';
import * as plmBlueprints from '../blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import { WorkbookResponse } from '@flatfile/api/api';
import { attributes as attributesBlueprint } from '../blueprints/_index';
import { ProductsShowApiService } from '../../../shared/products-show-api-service';
import { projectSpaceTheme } from '@/workflows/plm/themes/project-space-theme';
import { projectSpaceDocument } from '@/workflows/plm/documents/project-space-document';

const WORKBOOK_NAME = 'PLM Import';

export function plmProjectSpaceConfigure(listener: FlatfileListener) {
  listener.use(
    configureSpace(
      {
        documents: [projectSpaceDocument],
        workbooks: [
          {
            name: WORKBOOK_NAME,
            namespace: 'plmImport',
            sheets: [
              plmBlueprints.attributes,
              plmBlueprints.suppliers,
              plmBlueprints.categories,
              plmBlueprints.products,
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
      },
      async (event) => {
        const { spaceId } = event.context;
        const documents = await api.documents.list(spaceId);

        // Get the first documentId
        const documentId = documents.data[0]['id'];

        // Update the space adding theme and setting the documentId as the default page
        await api.spaces.update(spaceId, {
          metadata: {
            sidebarConfig: {
              showSidebar: true,
              defaultPage: {
                documentId,
              },
            },
            theme: projectSpaceTheme,
          },
        });
      }
    )
  );

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
}
