
import React, { useCallback, useContext } from 'react'
import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import {
  ExtensionContext2,
  ExtensionContextData2,
} from '@looker/extension-sdk-react'
import styled from 'styled-components'
import { Looker40SDK } from '@looker/sdk/lib/4.0/methods'

export const EmbedDashboard: React.FC<any> = ({ next, id }) => {
  const [dashboard, setDashboard] = React.useState<LookerEmbedDashboard>()
  const extensionContext = useContext<ExtensionContextData2<Looker40SDK>>(
    ExtensionContext2
  )
  const {extensionSDK} = extensionContext;

  const canceller = (event: any) => {
    const is_look_or_dashboard = (['look','dashboard'].indexOf(event.link_type) > -1);
    const is_dashboard_next = ( ( event?.url && event.url.startsWith('/embed/dashboards-next/') ) || ( event?.url && event.url.startsWith('/dashboards-next/') ) )
    const is_explore = (['dashboard:tile:explore','drillmodal:explore'].indexOf(event.type) > -1) 
    
    if ( is_dashboard_next || is_look_or_dashboard || is_explore ) {
      extensionSDK.openBrowserWindow(event.url.replace('/embed/','/'),'_blank')
    }
    return { cancel: !event.modal }
  }

  const setupDashboard = (dashboard: LookerEmbedDashboard) => {
    setDashboard(dashboard)
  }

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
      if (el && hostUrl) {
        el.innerHTML = ''
        LookerEmbedSDK.init(hostUrl)
        const db = LookerEmbedSDK.createDashboardWithId(id)
        if (next) {
          db.withNext();
        }
        db.appendTo(el)
          .on('drillmenu:click', canceller)
          .on('drillmodal:explore', canceller)
          .on('dashboard:tile:explore', canceller)
          .on('dashboard:tile:view', canceller)
          .build()
          .connect()
          .then(setupDashboard)
          .catch((error: Error) => {
            console.error('Connection error', error)
          })
      }
    },
    [next, id]
  )

  return (
    <>
      <EmbedContainer ref={embedCtrRef} />
    </>
  )
}


export const EmbedContainer = styled.div`
  width: 100%;
  height: 95vh;
  & > iframe {
    width: 100%;
    height: 100%;
  }
`