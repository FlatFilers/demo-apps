import { SyncedRecordsResponse } from '@/shared/api-service-base';
import { FlatfileEvent } from '@flatfile/listener';
import axios from 'axios';
import invariant from 'ts-invariant';

type TechnicianResult = {
  externalTechnicianId: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  skills: string | null;
  availability: string | null;
  licenseCertification: string | null;
  notes: string | null;
};

type ProductResult = {
  externalProductId: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  supplierId: string;
  attributes?: TechnicianResult[];
};

export class FieldServicesShowApiService {
  static syncSpace = async (
    event: FlatfileEvent
  ): Promise<SyncedRecordsResponse> => {
    const { spaceId } = event.context;

    try {
      const apiBaseUrl = await event.secrets('SERVICE_API_BASE_URL');
      invariant(
        apiBaseUrl,
        'Missing SERVICE_API_BASE_URL in environment secrets'
      );

      const response = await axios.get(
        `${apiBaseUrl}/api/webhook/sync-space/${spaceId}`,
        {
          headers: await this.headers(event),
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to submit data to webhook');
      }

      return response.data as SyncedRecordsResponse;
    } catch (error) {
      console.log(
        `Error calling sync space: ${
          error.message || JSON.stringify(error, null, 2)
        }`
      );
    }
  };

  static fetchTechnicians = async (
    event: FlatfileEvent
  ): Promise<TechnicianResult[]> => {
    console.log('Fetching technicians from service.show');

    const apiBaseUrl = await event.secrets('SERVICE_API_BASE_URL');
    const url = `${apiBaseUrl}/api/v1/technicians`;

    let response;

    try {
      response = await axios.get(url, {
        headers: await this.headers(event),
      });

      if (response.status !== 200) {
        throw new Error(`response status was ${response.status}`);
      }
    } catch (error) {
      console.error(`Failed to fetch technicians: ${error.message}`);
      response = [];
    }

    const technicians = response.data.technicians as TechnicianResult[];

    console.log('Technicians found: ' + JSON.stringify(technicians));

    return technicians;
  };

  static sendFilefeedEvent = async (event: FlatfileEvent) => {
    console.log('Sending filefeed event to service.show.');

    const { spaceId } = event.context;
    const topic = event.payload.job || event.topic;

    if (!topic) {
      return;
    }

    const apiBaseUrl = await event.secrets('SERVICE_API_BASE_URL');
    const url = `${apiBaseUrl}/api/webhook/filefeed-event`;

    let response;

    try {
      response = await axios.post(
        url,
        { spaceId, topic },
        { headers: await this.headers(event) }
      );

      if (response.status !== 200) {
        throw new Error(`response status was ${response.status}`);
      }
    } catch (error) {
      console.error(`Failed to send filefeed event: ${error.message}`);
    }
  };

  private static headers = async (event: FlatfileEvent) => {
    const listenerAuthToken = await event.secrets('LISTENER_AUTH_TOKEN');
    invariant(
      listenerAuthToken,
      'Missing LISTENER_AUTH_TOKEN in environment secrets'
    );

    return {
      'Content-Type': 'application/json',
      'x-listener-auth': listenerAuthToken,
      'x-space-id': event.context.spaceId,
    };
  };

  // TODO: What schema do we want here?
  static fetchProducts = async (event: FlatfileEvent) => {
    console.log('Fetching products from plm.show');

    const apiBaseUrl = await event.secrets('SERVICE_API_BASE_URL');
    const url = `${apiBaseUrl}/api/v1/products`;

    let response;

    try {
      response = await axios.get(url, {
        headers: await this.headers(event),
      });

      if (response.status !== 200) {
        throw new Error(`response status was ${response.status}`);
      }
    } catch (error) {
      console.error(`Failed to fetch products: ${error.message}`);
      response = [];
    }

    const products = response.data.products as ProductResult[];

    console.log('Products found: ' + JSON.stringify(products));

    return products;
  };
}
