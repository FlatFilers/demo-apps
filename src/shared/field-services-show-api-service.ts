import { SyncedRecordsResponse } from '@/shared/api-service-base';
import { FlatfileEvent } from '@flatfile/listener';
import axios from 'axios';
import invariant from 'ts-invariant';

// TODO: Adjust schemas
type AttributeResult = {
  externalId: string;
  name: string;
  value: string;
  unit?: string;
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
  attributes?: AttributeResult[];
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

  // TODO: What schema do we want here?
  static fetchAttributes = async (
    event: FlatfileEvent
  ): Promise<AttributeResult[]> => {
    console.log('Fetching attributes from products.show');

    const apiBaseUrl = await event.secrets('SERVICE_API_BASE_URL');
    const url = `${apiBaseUrl}/api/v1/attributes`;

    let response;

    try {
      response = await axios.get(url, {
        headers: await this.headers(event),
      });

      if (response.status !== 200) {
        throw new Error(`response status was ${response.status}`);
      }
    } catch (error) {
      console.error(`Failed to fetch attributes: ${error.message}`);
      response = [];
    }

    const attributes = response.data.attributes as AttributeResult[];

    console.log('Attributes found: ' + JSON.stringify(attributes));

    return attributes;
  };

  static sendFilefeedEvent = async (event: FlatfileEvent) => {
    console.log('Sending filefeed event to products.show.');

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
