/**
 * The background worker service, handles passing events between popups and CSUI content pages
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // eslint-disable-next-line no-console
  console.log("Received background worker message", request.action);
});

export {};
