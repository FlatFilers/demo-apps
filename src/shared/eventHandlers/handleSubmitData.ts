import { FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import invariant from 'ts-invariant';
import axios from 'axios';

export const handleSubmitData = () => (listener: FlatfileListener) => {
  listener.on('job:ready', { job: 'workbook:submitAction' }, async (event) => {
    // console.log("event", event);
    // console.log("context", event.context);
    // console.log("payload", event.payload);

    const { spaceId, jobId } = event.context;

    try {
      await api.jobs.ack(jobId, {
        info: 'Starting job to submit data to webhook',
        progress: 10,
      });

      const webhookUrl = await event.secrets('WEBHOOK_URL');
      invariant(webhookUrl, 'Missing WEBHOOK_URL in environment secrets');

      console.log('WebhookURl', webhookUrl);

      const response = await axios.get(
        `${webhookUrl}/api/webhook/sync-space/${spaceId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to submit data to webhook');
      }
    } catch (error) {
      console.log(`Error calling webhook: ${JSON.stringify(error, null, 2)}`);

      await api.jobs.fail(jobId, {
        outcome: {
          message: error,
        },
      });
    }

    await api.jobs.complete(jobId, {
      outcome: {
        message: 'Data was successfully submitted.',
      },
    });
  });
};
