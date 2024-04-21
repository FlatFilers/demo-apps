import { FlatfileEvent } from '@flatfile/listener';

export type SyncedRecordsResponse = {
  syncedFlatfileRecordIds: string[];
};

export type ApiService = {
  syncSpace: (event: FlatfileEvent) => Promise<SyncedRecordsResponse>;
};
