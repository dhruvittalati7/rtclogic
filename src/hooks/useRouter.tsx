import * as React from 'react'
import * as H from 'history'
// @ts-ignore
import { __RouterContext as RouterContext, RouteComponentProps, StaticContext } from 'react-router'

// FIXME:  use official API when https://github.com/ReactTraining/react-router/pull/6453 merged

export const useRouter = <Params extends { [K in keyof Params]?: string } = {}, C extends StaticContext = StaticContext, S = H.LocationState>() =>
  React.useContext(RouterContext) as RouteComponentProps<Params, C, S>
