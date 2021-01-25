import { IBoardItem } from '@looker/sdk/lib/4.0/models';
import React from 'react';
import { EmbedDashboard } from './EmbedDashboard';
import { LookMain } from './EmbedLook';

export function EmbedPage({item}: {item: IBoardItem}) {

  if (item.look_id) {
    return <LookMain id={item.look_id}/>
  } else if ( item.dashboard_id ) {
    return <EmbedDashboard next={(item.url!.indexOf('next')> -1)} id={item.dashboard_id} />
  } else {
    return <>uh oh! bad url</>
  }
}