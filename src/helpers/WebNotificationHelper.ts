export const pushNotification = (title: string, url?: string, options?: NotificationOptions) => {
  if (document.visibilityState === 'hidden' && window.navigator.serviceWorker.controller) {
    window.navigator.serviceWorker.controller.postMessage({ title, options, url })
  }
}
