import { FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import invariant from 'ts-invariant';
import axios from 'axios';

export const handleSubmitData =
  () =>
  (listener: FlatfileListener): void => {
    listener.on(
      'job:ready',
      { job: 'workbook:submitAction' },
      async (event) => {
        const { spaceId, jobId } = event.context;

        try {
          await api.jobs.ack(jobId, {
            info: 'Starting job to submit data to webhook',
            progress: 10,
          });

          const apiBaseUrl = await event.secrets('API_BASE_URL');
          invariant(apiBaseUrl, 'Missing API_BASE_URL in environment secrets');

          const response = await axios.get(
            `${apiBaseUrl}/api/webhook/sync-space/${spaceId}`,
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
          console.log(
            `Error calling webhook: ${
              error.message || JSON.stringify(error, null, 2)
            }`
          );

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
      }
    );
  };
