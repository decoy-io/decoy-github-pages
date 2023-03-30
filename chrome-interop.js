async function getCurrentTab() {
  var [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab
}

async function getUrlHost() {
  if (!chrome.tabs) return window.location.host
  var tab = await getCurrentTab()
  return tab.url.split('/')[2]
}

async function getCurrentTabId() {
  var tab = await getCurrentTab()
  return tab.id
}

async function getCurrentDomain() {
  var host = await getUrlHost()
  var domain = host.split('.').slice(-2).join('.')
  if (!domain.includes(chrome.runtime.id)) return domain
}

async function sendCredential(cred, tabId) {
  await chrome.runtime.sendMessage({ type: 'SEND-CRED', cred, tabId })
  window.close()
}
