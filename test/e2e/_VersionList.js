class VersionList {
  constructor(client) {
    this.client = client
  }

  get items() {
    return this.client.elements('[data-test-id=version-list] > [role=button]')
  }

  get self() {
    return this.client.element('[data-test-id=version-list]')
  }

  getItemAt(index) {
    // nth-child is not zero-based
    index++
    return this.client.element(`[data-test-id=version-list] > [role=button]:nth-child(${index})`)
  }
}

export default VersionList
