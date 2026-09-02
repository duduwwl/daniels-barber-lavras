export const productionSiteOrigin = 'https://daniels-barber-lavras.duduwwl.chatgpt.site';

export function appointmentApiUrl(path = '/api/appointments') {
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
    return `${productionSiteOrigin}${path}`;
  }
  return path;
}
