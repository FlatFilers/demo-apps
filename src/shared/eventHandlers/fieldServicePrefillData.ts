import { FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import { WorkbookResponse } from '@flatfile/api/api';
import * as fieldServicesBlueprints from '@/workflows/fieldServices/blueprints/_index';
import { FieldServicesShowApiService } from '@/shared/field-services-show-api-service';
import { FIELD_SERVICE_WORKBOOK_NAME } from '@/shared/constants';

export const fieldServicePrefillData =
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

      if (workbookName !== FIELD_SERVICE_WORKBOOK_NAME) {
        console.error('Error - no workbook found');
        return;
      }

      const sheets = workbook?.data?.sheets ? workbook.data.sheets : [];

      try {
        const techniciansSheet = sheets.find(
          (s) => s.config.slug === fieldServicesBlueprints.technicians.slug
        );

        console.log('Fetching technicians from fieldservice.show...');

        // Fetch technicians from fieldservice.show API
        const technicians = await FieldServicesShowApiService.fetchTechnicians(
          event
        );

        if (techniciansSheet && technicians && technicians.length > 0) {
          const techniciansheetId = techniciansSheet.id;

          const mappedtechnicians = technicians.map((t) => ({
            technician_id: { value: t.externalTechnicianId },
            name: { value: t.name },
            email: { value: t.email },
            phone_number: { value: t.phoneNumber },
            skills: { value: t.skills },
            availability: { value: t.availability },
            license_certification: { value: t.licenseCertification },
            notes: { value: t.notes },
          }));

          await api.records.insert(techniciansheetId, mappedtechnicians);
        }
      } catch (error) {
        console.error('Error inserting technicians:', error.message);
      }

      try {
        // Fetch customers from fieldservice.show API
        const customersSheet = sheets.find(
          (s) => s.config.slug === fieldServicesBlueprints.customers.slug
        );

        console.log('Fetching customers from fieldservice.show...');

        // Fetch customers from fieldservice.show API
        const customers = await FieldServicesShowApiService.fetchCustomers(
          event
        );

        if (customersSheet && customers && customers.length > 0) {
          const customerSheetId = customersSheet.id;

          const mappedCustomers = customers.map((c) => {
            return {
              customer_id: { value: c.externalCustomerId },
              name: { value: c.name },
              contact_person: { value: c.contactPerson },
              email: { value: c.email },
              phone_number: { value: c.phoneNumber },
              address: { value: c.address },
              preferred_contact_method: { value: c.preferredContactMethod },
              notes: { value: c.notes },
            };
          });

          await api.records.insert(customerSheetId, mappedCustomers);
        }
      } catch (error) {
        console.error('Error inserting customers:', error.message);
      }
    });
  };
