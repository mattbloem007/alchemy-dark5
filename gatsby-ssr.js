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

export function onRenderBody(
  { setHeadComponents,
    setPreBodyComponents,
  }
) {
 setHeadComponents([
   <script
    type="text/javascript"
    src="//static.klaviyo.com/onsite/js/klaviyo.js?company_id=VECYLf"
    ></script>,
    <script
     dangerouslySetInnerHTML={{
        __html:`
        window.omnisend = window.omnisend || [];
        omnisend.push(["accountID", "64917181025b19a15626b18b"]);
        omnisend.push(["track", "$pageViewed"]);
        !function(){var e=document.createElement("script");e.type="text/javascript",e.async=!0,e.src="https://omnisnippet1.com/inshop/launcher-v2.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}();
   	 `
     }}
     />
  ])
  // setPreBodyComponents([
  //   <div id="checkout">
  //     <div id="paypal-button-container"></div>
  //   </div>,
  // ])
}

const Wrapper = ({ element }) => {
  return <Alchemy element={element} />
}

export const wrapPageElement = Wrapper
