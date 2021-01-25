import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData2, ExtensionContext2 } from '@looker/extension-sdk-react';
import { Looker40SDK } from '@looker/sdk/lib/4.0/methods';
import { Box, TabList, TabPanels, TabPanel, Tabs, Tab, Flex, FlexItem, } from '@looker/components';
import styled from 'styled-components'
import { useParams } from 'react-router-dom';
import { NumberToColoredPercent } from './NumberToColoredPercent'
import { EmbedPage } from './EmbedPage';
import find from 'lodash/find';
import { IBoard } from '@looker/sdk/lib/4.0/models';

export function BoardPage( ) {
  const [board, setBoard] = useState<IBoard>()
  const [header_meta, setHeaderMeta] = useState<any>();
  const [second_meta, setSecondMeta] = useState<any>();
  const extensionContext = useContext<ExtensionContextData2<Looker40SDK>>(
    ExtensionContext2
  )
  const sdk = extensionContext.coreSDK;

  // @ts-ignore
  let {board_id} = useParams<any>();

  useEffect(()=>{
    if (board_id) {
      getBoard();
    }
  },[board_id])

  const getBoard = async () => {
    const b = await sdk.ok(sdk.board(Number(board_id)))
    setBoard(b);
    if (b.section_order && b.section_order?.length > 1) {
      const header_item = b.section_order[0]
      const header_section = find(b.board_sections, {id: header_item})

      let header_looks: any = [];
      
      if (header_section?.item_order?.length) {
        header_section!.item_order.forEach(io=>{
          const found = find(header_section?.board_items, {id: io})
          if (found?.look_id && found.look_id > 0) {
            header_looks.push(found)
          }
        })
      }

      const second_item = b.section_order[1]
      const second_section = find(b.board_sections, {id: second_item})

      let second_looks: any = [];
      
      if (second_section?.item_order?.length) {
        second_section!.item_order.forEach(io=>{
          const found = find(second_section?.board_items, {id: io})
          second_looks.push(found)
        })
      }

      setHeaderMeta(header_looks);
      setSecondMeta(second_looks);
    }
  }                                  

  if (board && header_meta?.length && second_meta?.length) {
    return (
      <Box p="small">
        <Tabs>
          <TabList>
            {header_meta!.map((m: any)=><Tab 
                key={m.id}
              >
                <Flex verticalAlign="bottom" justifyContent="space-between">
                  <FlexItem as="span" mr="xxsmall">
                    {m.title}
                  </FlexItem>
                  <FlexItem as="span">
                    <NumberToColoredPercent 
                      look_id={m.look_id!} 
                    />
                  </FlexItem>
                </Flex>
              </Tab>
            )}
          </TabList>
          <TabPanels>
            {second_meta!.map((m: any)=><TabPanel key={m.id}><EmbedPage item={m} /></TabPanel>)}
          </TabPanels>
        </Tabs>
      </Box>
    );
  } else {
    return <></>
  }

}

// @ts-ignore
export const Layout = styled(Box)`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 200px auto;
  width: 100vw;
`
