// modifySheet.ts
import { SheetConfig, Property } from '@flatfile/api/api';

export function modifySheet(originalSheet: SheetConfig): SheetConfig {
  const modifiedFields: Property[] = originalSheet.fields.map((field) => {
    if (field.type === 'reference') {
      const modifiedField: Property = {
        ...field,
        type: 'string',
        config: undefined,
      };
      return modifiedField;
    }
    return field;
  });

  return {
    ...originalSheet,
    fields: modifiedFields,
  };
}
