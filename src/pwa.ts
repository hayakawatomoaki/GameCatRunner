export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    void navigator.serviceWorker
      .register('./service-worker.js')
      .then((registration) => registration.update())
      .catch(() => undefined);
  });
}
