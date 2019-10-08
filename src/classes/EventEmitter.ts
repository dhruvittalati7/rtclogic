interface TObservers {
  [key: string]: Function[]
}

abstract class EventEmitter {
  protected observers: TObservers = {}

  /**
   * @public
   * @param {string} eventName
   * @param {Function} observer
   */
  public on = (eventName: string, observer: Function) => {
    if (!this.observers[eventName]) {
      this.observers[eventName] = []
    }
    this.observers[eventName].push(observer)
  }

  /**
   * @private
   * @param {string} eventName
   * @param {Object|undefined} data
   */
  protected fire = (eventName: string, data: TObjectAny = {}) => {
    if (this.observers[eventName]) {
      this.observers[eventName].forEach(i => i(data))
    }
  }
}

export { EventEmitter }
