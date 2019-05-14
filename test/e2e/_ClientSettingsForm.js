const delay = time => new Promise(resolve => setTimeout(resolve, time));

class ClientSettingsForm {
  constructor (client) {
    this.client = client
  }

  getInput(name) {
    return this.client.element(`[data-test-id=input-text-${name}] input`)
  }

  getSelect(name) {
    return this.client.element(`[data-test-id=input-select-${name}] [role=button]`)
  }

  async chooseSelectOption(name, value) {
    await delay(200)
    await this.getSelect(name).click()
    await this.selectPopupMenuOptionByValue(value).click()

    // waits until uppermost layer has been removed from DOM
    const client = this.client
    await this.client.waitUntil(async () => {
      const modal = await client.$('div[role=presentation]')
      return modal.state === 'failure'
    })
  }

  selectPopupMenuOptionByValue(value) {
    return this.client.$('div[role=presentation]').$(`[data-value=${value}]`)
  }

}

export default ClientSettingsForm
