chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.type == 'GET-CRED') {
    chrome.windows.create({
      url: 'index.html?currentDomain=' + request.domain + '&currentTabId=' + sender.tab.id,
      width: 600,
      height: 600,
      type: 'popup'
    })
  }

  if (request.type == 'SEND-CRED') {
    console.log(request.tabId)
    chrome.tabs.sendMessage(request.tabId, { cred: request.cred, type: 'SEND-CRED' })
  }
})
