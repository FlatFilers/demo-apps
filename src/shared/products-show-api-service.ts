import { FlatfileEvent } from '@flatfile/listener';
import axios from 'axios';
import { getUserIdFromSpace } from './utils/get-user-id-from-space';

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

    const attributes = response.attributes as AttributeResult[];

    console.log('Attributes found: ' + JSON.stringify(attributes));

    return attributes;
  };

  private static headers = async (event: FlatfileEvent) => {
    const listenerAuthToken = await this.getListenerAuthToken(event);
    const userId = await getUserIdFromSpace(event.context.spaceId);

    return {
      'Content-Type': 'application/json',
      'x-listener-auth': listenerAuthToken,
      'x-user-id': userId,
    };
  };

  private static getListenerAuthToken = async (event: FlatfileEvent) => {
    try {
      return await event.secrets('LISTENER_AUTH_TOKEN');
    } catch (e) {
      const message = 'Error - no LISTENER_AUTH_TOKEN found in secrets';
      console.error(message);
      throw new Error(message);
    }
  };
}
