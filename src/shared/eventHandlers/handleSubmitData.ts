import { FlatfileListener } from '@flatfile/listener';
import api from '@flatfile/api';
import { ProductsShowApiService } from '../products-show-api-service';

export const handleSubmitData =
  () =>
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

          await ProductsShowApiService.syncSpace(event);

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
