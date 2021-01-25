import React, { useContext, useEffect, useState } from 'react';
import styled, {keyframes} from 'styled-components';
import { Text } from '@looker/components';
import { ExtensionContextData2, ExtensionContext2 } from '@looker/extension-sdk-react';
import { Looker40SDK } from '@looker/sdk/lib/4.0/methods';

export function NumberToColoredPercent( {look_id}: any) {
  const [first_row, setFirstRow] = useState<any>();
  
  const extensionContext = useContext<ExtensionContextData2<Looker40SDK>>(
    ExtensionContext2
  )

  const sdk = extensionContext.coreSDK

  useEffect(()=>{
    if (look_id) {
      getData();
    }
  })

  const getData = async () => {
    const r = await sdk.ok(sdk.run_look({
      look_id,
      result_format: 'json_label'
    }))
    setFirstRow(r[0])
  }

  if (first_row === undefined) {
    return <TextLoadingSpan>{' '}</TextLoadingSpan>
  } else {
    const val = (first_row?.display) ? first_row.display : 0;
    const color = (val<0) ? 'red' : (val>0) ? 'green' : 'black'
    const val_formatted = Math.abs(val).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })
    const icon = (val<0) ? '▼' : (val>0) ? '▲' : '—'
    return (
      <Text 
        color={color}
        fontWeight="medium"
        fontSize="xxsmall"
      >
        {`${icon} ${val_formatted}`}
      </Text>
    )
  }
}

const kf = keyframes`
0% {
  background-position: -200px 0px;
}
100% {
  background-position: calc(200px + 100%) 0px;
}`;

const TextLoadingSpan = styled.span`
cursor: pointer;
user-select: none;
box-sizing: border-box;
padding: 0px;
background-size: 200px 100%;
display: flex;
line-height: 1;
width: 100%;
min-width: 30px;
height: 11px;
background-repeat: no-repeat;
border-radius: 4px;
background-color: rgb(245, 246, 247);
background-image: linear-gradient(90deg, rgb(245, 246, 247), rgb(222, 225, 229), rgb(245, 246, 247));
animation: 1.2s ease-in-out 0s infinite normal none running ${kf};
`

