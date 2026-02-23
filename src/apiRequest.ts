import { fetch } from './fetch';

const apiRequest = async (url: string, options?: RequestInit, apiKey?: string): Promise<Response> => {
  return fetch(url, {...options, headers: {...options?.headers, 'Authorization': `Bearer ${apiKey}`}, credentials: 'include'});
}

export default apiRequest;