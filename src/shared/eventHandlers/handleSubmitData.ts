import { FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import { ApiService } from '@/shared/api-service-base';

export const handleSubmitData =
  ({ apiService }: { apiService: ApiService }) =>
  (listener: FlatfileListener): void => {
    listener.on(
      'job:ready',
      { job: 'workbook:submitAction' },
      async (event) => {
        const { jobId } = event.context;

        try {
          await api.jobs.ack(jobId, {
            info: 'Starting job to submit data to webhook',
            progress: 10,
          });

          await apiService.syncSpace(event);

          await api.jobs.complete(jobId, {
            outcome: {
              message: 'Data was successfully submitted.',
            },
          });
        } catch (error) {
          await api.jobs.fail(jobId, {
            outcome: {
              message: error,
            },
          });
        }
      }
    );
  };
