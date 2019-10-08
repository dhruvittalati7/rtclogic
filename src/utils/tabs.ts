export const hasOpenTabs = () => {
  return parseInt(localStorage.getItem('tirade_tab_cnt') || '0') > 0
}

export const incrementOpenTabs = () => {
  let openTabs = parseInt(localStorage.getItem('tirade_tab_cnt') || '0')
  openTabs = openTabs + 1
  localStorage.setItem('tirade_tab_cnt', openTabs.toString())
}

export const decrementOpenTabs = () => {
  let openTabs = parseInt(localStorage.getItem('tirade_tab_cnt') || '0')
  openTabs = openTabs - 1
  if (openTabs < 0) {
    openTabs = 0
  }
  localStorage.setItem('tirade_tab_cnt', openTabs.toString())
}
