import React, { useState } from 'react'
import { Main } from './Main'
import { ExtensionProvider2 } from '@looker/extension-sdk-react'
import { hot } from 'react-hot-loader/root'
import { Looker40SDK } from '@looker/sdk/lib/4.0/methods'

export const App: React.FC<{}> = hot(() => {
  const [route, setRoute] = useState('')
  const [routeState, setRouteState] = useState()

  const onRouteChange = (route: string, routeState?: any) => {
    setRoute(route)
    setRouteState(routeState)
  }

  return (
    <ExtensionProvider2 
    onRouteChange={onRouteChange} 
    type={Looker40SDK} 
    chattyTimeout={-1}
    loadingComponent={<>hi</>}
  >
      <Main 
        // @ts-ignore
        route={route} 
        routeState={routeState} 
      />
    </ExtensionProvider2>
  )
})
