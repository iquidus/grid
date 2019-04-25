import * as path from 'path'
import fs from 'fs'

const rmGethDir = function () {
  try {
    const files = fs.readdirSync(path.resolve('./ethereum_clients/bin_geth/'))
    files.map(e => fs.unlinkSync(path.resolve(`./ethereum_clients/bin_geth/${e}`)))
  }
  catch(e) {
    console.log('rmGeth', e);
  }
}

export default rmGethDir
