/**
 * This module sets up and configures validations for processing records through Flatfile.
 */

import { FlatfileListener } from '@flatfile/listener';
import { plmValidations } from '../../workflows/plm/validations/plmValidations';
import { hcmValidations } from '../../workflows/hcm/validations/hcmValidations';

/**
 * @param {FlatfileListener} listener - The FlatfileListener instance to which custom
 * validations are attached. This object acts as the conduit through which records are
 * received from Flatfile, validated, and potentially modified or flagged for correction.
 */
export function validations(listener: FlatfileListener) {
  listener.use(plmValidations);
  listener.use(hcmValidations);
}

export function isNotNil(value: any): boolean {
  console.log('value:', value, typeof value);
  return (
    value !== null &&
    value !== undefined &&
    value !== '' &&
    !Array.isArray(value)
  );
}

export function isNil(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    Array.isArray(value)
  );
}
