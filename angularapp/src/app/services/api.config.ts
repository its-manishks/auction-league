/**
 * Resolves the Spring Boot API base URL at runtime so the same build works:
 *  - locally                  http://localhost:4200 or :8081  -> http://localhost:8080/api
 *  - on the examly workspace  https://8081-<id>.premiumproject.examly.io -> https://8080-<id>.../api
 *  - on a LAN host / other    http(s)://<host>:<port>          -> http(s)://<host>:8080/api
 */
const FALLBACK_API_URL =
  'https://8080-badcfbcdabdaa354183437befacdfbbcdfeone.premiumproject.examly.io/api';

export function resolveApiBaseUrl(): string {
  try {
    const { protocol, hostname } = window.location;

    if (!hostname) {
      return FALLBACK_API_URL;
    }

    // Examly-style port-prefixed hosts: "8081-xyz.premiumproject.examly.io"
    const portPrefixed = hostname.match(/^\d{2,5}-(.+)$/);
    if (portPrefixed) {
      return `${protocol}//8080-${portPrefixed[1]}/api`;
    }

    return `${protocol}//${hostname}:8080/api`;
  } catch {
    return FALLBACK_API_URL;
  }
}

export const API_BASE_URL = resolveApiBaseUrl();
