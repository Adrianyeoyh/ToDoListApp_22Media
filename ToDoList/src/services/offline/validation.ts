import { ApiError } from '@/services/utils/api';

const MAX_LENGTH = 255;

// Mirrors the backend rules so forms still show inline errors while offline.
export function assertValidText(field: 'name' | 'description', value: string) {
  const message =
    value === ''
      ? `The ${field} field is required.`
      : value.length > MAX_LENGTH
        ? `The ${field} field must not be greater than ${MAX_LENGTH} characters.`
        : null;

  if (message) {
    throw new ApiError(422, { message, errors: { [field]: [message] } });
  }
}
