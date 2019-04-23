import test from 'ava'
import ApplicationFactory from './_ApplicationFactory'

test.beforeEach(async t => {
  t.context.app = ApplicationFactory.development()

  console.log(t.context.app);
  await t.context.app.start()
})

test.afterEach.always(async t => {
  await t.context.app.stop()
})

test('start app', async t => {
  const app = t.context.app
  await app.client.waitUntilWindowLoaded(20000)
  await app.client.waitUntilTextExists('button', 'NODES', 5000)

  const win = app.browserWindow
  t.is(await app.client.getWindowCount(), 2)
  t.true(await win.isVisible())
})
