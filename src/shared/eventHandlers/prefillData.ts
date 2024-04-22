import { FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import { WorkbookResponse } from '@flatfile/api/api';
import { WORKBOOK_NAME } from '@/workflows/plm/actions/plmProjectSpaceConfigure';
import { ProductsShowApiService } from '@/shared/products-show-api-service';
import * as plmBlueprints from '@/workflows/plm/blueprints/_index';

export const prefillData =
  () =>
  (listener: FlatfileListener): void => {
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

      if (workbookName !== WORKBOOK_NAME) {
        console.error('Error - no workbook found');
        return;
      }

      const sheets = workbook?.data?.sheets ? workbook.data.sheets : [];

      try {
        const attributesSheet = sheets.find(
          (s) => s.config.slug === plmBlueprints.attributes.slug
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

          await api.records.insert(attributeSheetId, mappedAttributes);
        }
      } catch (error) {
        console.error('Error inserting attributes:', error.message);
      }

      try {
        // Fetch suppliers from products.show API
        const suppliersSheet = sheets.find(
          (s) => s.config.slug === plmBlueprints.suppliers.slug
        );

        console.log('Fetching suppliers from products.show...');

        // Fetch suppliers from products.show API
        const suppliers = await ProductsShowApiService.fetchSuppliers(event);

        if (suppliersSheet && suppliers && suppliers.length > 0) {
          const supplierSheetId = suppliersSheet.id;

          const mappedSuppliers = suppliers.map((s) => {
            return {
              supplier_id: { value: s.externalSupplierId },
              name: { value: s.name },
              email: { value: s.email },
              phone: { value: s.phone },
              address: { value: s.address },
              city: { value: s.city },
              state: { value: s.state },
              country: { value: s.country },
            };
          });

          await api.records.insert(supplierSheetId, mappedSuppliers);
        }
      } catch (error) {
        console.error('Error inserting suppliers:', error.message);
      }

      try {
        // Fetch categories from products.show API
        const categoriesSheet = sheets.find(
          (s) => s.config.slug === plmBlueprints.categories.slug
        );

        console.log('Fetching categories from products.show...');

        // Fetch categories from products.show API
        const categories = await ProductsShowApiService.fetchCategories(event);

        if (categoriesSheet && categories && categories.length > 0) {
          const categoriesheetId = categoriesSheet.id;

          const mappedCategories = categories.map((c) => {
            return {
              category_id: { value: c.externalCategoryId },
              name: { value: c.name },
              description: { value: c.description },
            };
          });

          await api.records.insert(categoriesheetId, mappedCategories);
        }
      } catch (error) {
        console.error('Error inserting categories:', error.message);
      }
    });
  };
