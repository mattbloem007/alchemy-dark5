/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it

// const React = require("react")
// const Layout = require("./src/components/layout").default
//
// exports.wrapPageElement = ({ element, props }) => {
//   // props provide same data to Layout as Page element will get
//   // including location, data, etc - you don't need to pass it
//   return <Layout>{element}</Layout>
// }

import Alchemy from './src/root-wrapper'
import React from 'react'

const Wrapper = ({ element }) => {
  return <Alchemy element={element} />
}

export const wrapPageElement = Wrapper
