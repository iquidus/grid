import test from 'ava'
import {Application} from 'spectron'

test.beforeEach(async t => {
  t.context.app = new Application({
    path: '/Applications/Grid.app/Contents/MacOS/Grid'
  })
  await t.context.app.start()
})

test.afterEach.always(async t => {
  await t.context.app.stop()
})

test('basic app', async t => {
  const app = t.context.app
  await app.client.waitUntilWindowLoaded(20000)
  await app.client.waitUntilTextExists('button', 'NODES', 5000)

  const win = app.browserWindow
  t.is(await app.client.getWindowCount(), 1)
  t.true(await win.isVisible())
})

test('Should quit when main window is closed', async t => {
  const app = t.context.app
  await app.client.waitUntilWindowLoaded(10000)

  console.log('window 1', await app.client.getFocusedWindow())
  await app.client.
})

test('', async t => {
  const app = t.context.app
  await app.client.waitUntilWindowLoaded(10000)
})
