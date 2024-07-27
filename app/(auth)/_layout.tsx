import { Redirect, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

// import { Loader } from "../../components";
import { useGlobalContext } from '../../contexts/GlobalProvider'

const AuthLayout = (): JSX.Element => {
  const { loading, isLogged } = useGlobalContext()

  if (!loading && isLogged) return <Redirect href='/home' />

  return (
    <>
      <Stack>
        <Stack.Screen
          name='sign-in'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='sign-up'
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      {/* <Loader isLoading={loading} /> */}
      <StatusBar backgroundColor='#161622' style='light' />
    </>
  )
}

export default AuthLayout
