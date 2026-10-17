import { HttpErrorResponse } from '@angular/common/http';

/**
 * Turns any HttpClient error into one readable sentence.
 * The Spring backend returns plain strings for business errors and a
 * { field: message } map for bean-validation errors.
 */
export function readApiError(error: unknown, fallback = 'The server rejected that request.'): string {
  const err = error as HttpErrorResponse;

  if (!err) {
    return fallback;
  }

  if (err.status === 0) {
    return 'Cannot reach the server. Check that the Spring Boot backend is running on port 8080.';
  }

  const body = err.error;

  if (typeof body === 'string' && body.trim() && !body.trim().startsWith('<')) {
    return body.trim();
  }

  if (body && typeof body === 'object') {
    if (typeof body.message === 'string' && body.message) {
      return body.message;
    }
    // Bean-validation map, e.g. { "age": "Age must be at least 15" }
    const values = Object.values(body).filter((v) => typeof v === 'string') as string[];
    if (values.length && !body.status) {
      return values.join(' ');
    }
    if (typeof body.error === 'string' && body.error) {
      return body.error;
    }
  }

  return fallback;
}
