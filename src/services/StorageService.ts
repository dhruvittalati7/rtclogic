class StorageService {
  /**
   * @param {string} key
   * @param {*} defaultValue
   * @return {*}
   */
  public get(key: string, defaultValue?: any) {
    const storageValue = localStorage.getItem(key)
    if (storageValue) {
      try {
        return JSON.parse(storageValue)
      } catch (e) {
        return defaultValue
      }
    }
    return defaultValue
  }

  /**
   * @public
   * @param {string} key
   * @param {*} value
   */
  public set(key: string, value: any) {
    const storageValue = JSON.stringify(value)
    localStorage.setItem(key, storageValue)
  }

  /**
   * @public
   * @param key
   */
  public remove(key: string) {
    localStorage.removeItem(key)
  }
}

const storageService = new StorageService()
export { storageService }
