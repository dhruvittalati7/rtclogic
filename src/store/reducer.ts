import { history } from 'src/store/history'
import { initialState } from 'src/store/state'
import { AnyAction, combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { IAppState } from 'src/store/index'

export const APP_NEXT_STATE = '@APP_NEXT_STATE'
export const APP_NEXT_STATE_INTERNAL = '@APP_NEXT_STATE_INTERNAL'

const appReducer = (state: IAppState = initialState, action: AnyAction) => (action.type === APP_NEXT_STATE ? action.state : state)

const internalReducer = (state: TObjectAny = {}, action: AnyAction) => (action.type === APP_NEXT_STATE_INTERNAL ? action.state : state)

export const rootReducer = combineReducers({
  app: appReducer,
  internal: internalReducer,
  router: connectRouter(history),
})
