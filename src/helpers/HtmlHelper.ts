export const listenClickOutside = (elem: any, cb: (...args: any) => void) => {
  const isParent = (el: any, ofEl: any): boolean => {
    const p = ofEl.parentNode
    if (p === el) {
      return true
    }
    return p ? isParent(el, p) : false
  }
  const clickListener = (e: any) => {
    if (!isParent(elem, e.target)) {
      cb()
    }
  }
  const destroyer = () => document.removeEventListener('click', clickListener)
  document.addEventListener('click', clickListener)
  return destroyer
}
