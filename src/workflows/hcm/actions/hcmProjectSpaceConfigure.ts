import { configureSpace } from '@flatfile/plugin-space-configure';
import * as hcmBlueprints from '../blueprints/_index';
import { FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import { projectSpaceTheme } from '@/workflows/themes/project-space-theme';
import { projectSpaceDocument } from '@/workflows/hcm/documents/project-space-document';
import { HCM_WORKBOOK_NAME } from '@/shared/constants';

export function hcmProjectSpaceConfigure(listener: FlatfileListener) {
  listener.use(
    configureSpace(
      {
        documents: [projectSpaceDocument],
        workbooks: [
          {
            name: HCM_WORKBOOK_NAME,
            namespace: 'hcmImport',
            sheets: [
              hcmBlueprints.departments,
              hcmBlueprints.employees,
              hcmBlueprints.jobs,
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
        const documentId =
          documents.data.length > 0 ? documents.data[0]['id'] : null;

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
}
