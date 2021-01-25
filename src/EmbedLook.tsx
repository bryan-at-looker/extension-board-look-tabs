import React, { useCallback, useContext, useEffect, useState } from 'react'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import {  ExtensionContext2, ExtensionContextData2 } from '@looker/extension-sdk-react'
import {  Flex, FlexItem } from '@looker/components';
import styled from 'styled-components'
import { Looker40SDK } from '@looker/sdk/lib/4.0/methods';
import { IQuery } from '@looker/sdk/lib/4.0/models';

export function LookMain({id}: any) {
  const [query, setQuery] = useState<IQuery | undefined>();
  const extensionContext = useContext<ExtensionContextData2<Looker40SDK>>(
    ExtensionContext2
  )
  const sdk = extensionContext.coreSDK

  useEffect(()=>{
    if (id) {
      getLook();
    }
  },[id])

  const getLook = async () => {
    const l = await sdk.ok(sdk.look(id))
    setQuery(l.query)
  }

  return (
    <Flex 
      flexDirection="column"
      height="95vh"
      p="large"
    >
      <FlexItem height="50%">
        <LookEmbed setQuery={setQuery} query_id={ (query)?query.id:0 } look_id={id}/>
      </FlexItem>
      <FlexItem height="50%">
        {query && <LookTable query={query}/>}
      </FlexItem>
    </Flex>
  );
}

function LookEmbed( { query_id, setQuery, look_id }: any) {
  const [look, setLook] = useState<any>()
  const extensionContext = useContext<ExtensionContextData2<Looker40SDK>>(
    ExtensionContext2
  )
  const sdk = extensionContext.coreSDK

  const handlePageChange = async (event: any) => {
    const url = new URL(event.page.absoluteUrl)
    const qid = url.searchParams.get('qid')
    if (qid) {
      const q = await sdk.ok(sdk.query_for_slug(qid))
      if (query_id != q.id) {
        setQuery(q)
        if (look) {
          look.run();
        }
      }
    }
  }

  const embedCtrRef = useCallback(el => {
    const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    if (el && hostUrl && look_id) {    
      el.innerHTML = ''
      LookerEmbedSDK.init(hostUrl)
      LookerEmbedSDK.createLookWithId(look_id)
        .appendTo(el)
        .on('page:changed', handlePageChange)
        .build()
        .connect()
        .then(setLook)
        .catch((error: Error) => {
          console.error('Connection error', error)
        })
    }
  }, [look_id])

  return (
    <EmbedContainer
      ref={embedCtrRef}
    ></EmbedContainer>
  );
}

function LookTable( {query}: any) {
  const extensionContext = useContext<ExtensionContextData2<Looker40SDK>>(
    ExtensionContext2
  )  

  const embedCtrRef = useCallback(el => {
    const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    if (el && hostUrl && query) {    
      el.innerHTML = ''
      LookerEmbedSDK.init(hostUrl)
      const search = {
        qid: query.client_id,
        vis: JSON.stringify({
          type: 'looker_grid',  
          table_theme: "transparent"
        }),
        sdk: '2',
        embed_domain: hostUrl,
        sandboxed_host: true
      }
      const params = Object.keys(search).map(function(k) {
        // @ts-ignore
        return encodeURIComponent(k) + '=' + encodeURIComponent(search[k])
      }).join('&')
      
      LookerEmbedSDK.createLookWithUrl(`${hostUrl}/embed/query/${query.model}/${query.view}?${params}`)
        .appendTo(el)
        .build()
        .connect()
        .then()
        .catch((error: Error) => {
          console.error('Connection error', error)
        })
    }
  }, [query])

  return (
    <EmbedContainer
      ref={embedCtrRef}
    ></EmbedContainer>
  );
}

export const EmbedContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;

  & > iframe {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`