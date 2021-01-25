import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Box, ComponentsProvider } from '@looker/components'
import { BoardPage } from './BoardPage'

export const Main: React.FC = ({
  route,
  routeState,
}: any) => {

  return (
    <ComponentsProvider>
      <Box backgroundColor="background">
        <Switch>
          <Route path='/boards/:board_id'>
            <BoardPage />
          </Route>
          <Redirect to='/boards/5' />
        </Switch>
      </Box>
    </ComponentsProvider>
  )
}