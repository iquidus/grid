import test from 'ava'
import ApplicationFactory from './_ApplicationFactory'
import ClientAppBar from './_ClientAppBar'
import MainAppBar from './_MainAppBar'
import VersionList from './_VersionList'

const init = async function(t) {
  const app = t.context.app
  await app.client.waitUntilWindowLoaded(20000)
  const win = app.browserWindow
  const client = app.client
  return { app, win, client }
}

test.beforeEach(async t => {
  t.context.app = ApplicationFactory.development()

  // console.log(t.context.app);
  await t.context.app.start()
})

test.afterEach.always(async t => {
  await t.context.app.stop()
})

test('As a user, I want to download a geth node', async t => {
  const {app, client, win} = await init(t)
  const versionList = new VersionList(app.client)

  await versionList.waitToLoad()

  // Click on first list item
  await versionList.clickOnItem(0)

  // Wait for download to start
  await versionList.waitUntilVersionDownloading(0)

  // Wait for download to finish
  await versionList.waitUntilVersionSelected(0)

  t.true(true)
})

// As a user, I want to download a node
// As a user, I want to start/stop my geth node from the app UI. #38
// As a user, I want to configure my node settings and options easily. #37
// As a user, I want to have the connection details remembered, so I can have a consistent use of the app #23
// As a user, I want to be reminded of updates on the app itself, so I can get latest features and fixes. #33
// As a user, I want to see sync status visually, so I don't have to parse the logs and guess #73
// As a user, I want to provide an existing network data directory, so that I don't have two copies of the network. #35
// As a developer, I want to test Grid-UI build channels from the Grid [shell] interface, so we can ensure app quality standards #87
// As a user, I want to be notified when a new version of my node is available, so I don't fork. #22
// As a user, I want to download codesigned applications, so it works without nasty warnings on my OS #114
