const fs = require('fs')
const path = require('path')
const { EventEmitter } = require('events')
const { Plugin, PluginProxy } = require('./Plugin')
const { getPluginCachePath } = require('./util')
const { AppManager } = require('@philipplgh/electron-app-manager')

function requireFromString(src, filename) {
  var Module = module.constructor
  var m = new Module()
  m._compile(src, filename)
  return m.exports
}

// TODO add file to electron packaged files
class PluginHost extends EventEmitter {
  constructor() {
    super()
    this.plugins = []
    this.discover()
      .then(plugins => {
        this.plugins = this.plugins.concat(plugins)
        // TODO emit plugins discovered
      })
      .catch(err => console.log('plugins could not be loaded', err))

    this.discoverRemote()
      .then(plugins => {
        this.plugins = this.plugins.concat(plugins)
        console.log(`${plugins.length} remote plugins found`)
      })
      .catch(err => {
        console.log('remote plugins could not be loaded', err)
      })
      .finally(() => {
        this.emit('plugins-loaded')
      })
  }
  loadPluginFromFile(fullPath) {
    const pluginConfig = require(fullPath)
    // 2. TODO validate / verify
    const plugin = new Plugin(pluginConfig)
    return plugin
  }
  async loadPluginFromPackage(pkg) {
    const index = await pluginManager.getEntry(pkg, 'package/index.js')
    const indexContent = await index.file.readContent()
    const pluginConfig = requireFromString(
      indexContent.toString(),
      `${pkg.location}/package/index.js`
    )
    const plugin = new Plugin(pluginConfig)
    return plugin
  }
  async discoverRemote() {
    const PLUGIN_DIR = path.join(__dirname, 'client_plugins')
    let remotePluginList = []
    try {
      remotePluginList = JSON.parse(
        fs.readFileSync(path.join(PLUGIN_DIR, 'plugins.json'))
      )
    } catch (error) {
      console.log('Error: could not parse plugin list', error)
    }
    let releases = remotePluginList.map(async pluginShortInfo => {
      try {
        const { location } = pluginShortInfo
        if (fs.existsSync(location)) {
          // load package from provided path
          // FIXME allow this only in dev mode
          if (fs.statSync(location).isDirectory()) {
            // TODO plugin can be named differently and specified in package.json
            const plugin = this.loadPluginFromFile(
              path.join(location, 'index.js')
            )
            return plugin
          } else {
            const plugin = this.loadPluginFromFile(location)
            return plugin
          }
        } else {
          const pluginManager = new AppManager({
            repository: pluginShortInfo.repository,
            auto: false,
            paths: [],
            cacheDir: getPluginCachePath(pluginShortInfo.name)
          })
          // load package from cache or server:
          let latest = await pluginManager.getLatest()
          if (!latest) {
            return undefined
          }
          // download if necessary -> no cached found
          if (latest.remote) {
            latest = await pluginManager.download(latest)
            if (!latest) {
              console.log('error: plugin could not be fetched')
              return undefined
            }
          }
        }
        const plugin = await this.loadPluginFromPackage(latest)
        return plugin
      } catch (error) {
        const { name } = pluginShortInfo
        console.log(`remote plugin ${name} could not be loaded`, error)
        return undefined
      }
    })
    const plugins = await Promise.all(releases)
    return plugins.filter(p => p !== undefined)
  }
  async discover() {
    const PLUGIN_DIR = path.join(__dirname, 'client_plugins')
    const pluginFiles = fs.readdirSync(PLUGIN_DIR)
    console.time('plugin init')
    const plugins = []
    pluginFiles.forEach(f => {
      if (!f.endsWith('.js')) return
      try {
        const fullPath = path.join(PLUGIN_DIR, f)
        const plugin = this.loadPluginFromFile(fullPath)
        plugins.push(plugin)
      } catch (error) {
        console.log(`plugin ${f} could not be loaded`, error)
      }
    })
    console.timeEnd('plugin init')
    return plugins
  }
  getAllMetadata() {
    return this.plugins.map(p => p.config)
  }
  // called from renderer
  getAllPlugins() {
    return this.plugins.map(p => new PluginProxy(p))
  }
  getPluginByName(name) {
    return this.getAllPlugins().find(p => p.name === name)
  }
  start(name) {
    console.log('start plugin', name)
  }
  stop(name) {
    console.log('stop plugin', name)
  }
}

const registerGlobalPluginHost = () => {
  global.PluginHost = new PluginHost()
  return global.PluginHost
}

module.exports.registerGlobalPluginHost = registerGlobalPluginHost

module.exports.PluginHost = PluginHost
