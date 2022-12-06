import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import Layout from './components/Layout'
import theme from './@chakra-ui/gatsby-plugin/theme.js'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'



function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider)
}

export const wrapPageElement = ({ element }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider theme={theme} resetCSS>
        <Layout>{element}</Layout>
      </ChakraProvider>
    </Web3ReactProvider>
  )
}
