declare global {
  interface Window {
    env: any;
  }
}

export const environment = {
  production: true,
  url: window.env.url || 'http://localhost:8080',
  baseRef: window.env.baseRef || '/'
};
