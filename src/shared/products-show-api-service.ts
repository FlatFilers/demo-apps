import { FlatfileEvent } from '@flatfile/listener';
import axios from 'axios';
import invariant from 'ts-invariant';

type AttributeResult = {
  externalId: string;
  name: string;
  value: string;
  unit?: string;
};

export class ProductsShowApiService {
  static fetchAttributes = async (
    event: FlatfileEvent
  ): Promise<AttributeResult[]> => {
    console.log('Fetching attributes from products.show');

    const apiBaseUrl = await event.secrets('API_BASE_URL');
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
}
