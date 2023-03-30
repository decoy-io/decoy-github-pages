var username
var password

async function getCurrentTab() {
  var [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab
}

async function getUrlHost() {
  if (!chrome.tabs) return window.location.host
  var tab = await getCurrentTab()
  return tab.url.split('/')[2]
}

async function getDomain() {
  var host = await getUrlHost()
  return host.split('.').slice(-2).join('.')
}

function handelDoubleClick(target) {
  var isUsernameField = target.type == 'text' || target.type == 'email'
  var isPassword = target.type == 'password'
  var isEmpty = !target.value

  if (isUsernameField && isEmpty) insertUsername(target)
  if (isPassword) insertPassword(target)
}

function registerTab() {
  document.body.addEventListener('dblclick', event => handelDoubleClick(event.target))
  chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.type == 'SEND-CRED') {
      username = request.cred.username
      password = request.cred.password
      handelDoubleClick(document.activeElement)
    }
  })
}

async function requestCredentials() {
  var domain = await getDomain()
  chrome.runtime.sendMessage({ type: 'GET-CRED', domain })
}

function insertText(target, text) {
  target.focus()
  document.execCommand('selectAll', false)
  document.execCommand('insertText', false, text)
}

async function insertUsername(target) {
  if (username) {
    insertText(target, username)
    username = undefined
  } else requestCredentials()
}

async function insertPassword(target) {
  if (password) {
    insertText(target, password)
    password = undefined
  } else requestCredentials()
}

registerTab()
