import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://app.snipcart.com" />
        <link rel="preconnect" href="https://cdn.snipcart.com" />
        <link
          rel="stylesheet"
          href="https://cdn.snipcart.com/themes/v3.3.3/default/snipcart.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          async
          src="https://cdn.snipcart.com/themes/v3.3.3/default/snipcart.js"
        ></script>
        <div
          hidden
          id="snipcart"
          data-api-key="MGQyZWY4Y2YtYjU1Zi00MDM4LTg5ODAtMzRhMWUwYTNhOWFjNjM3ODU5MTEwNjkxMjg2NzQ5"
          data-config-add-product-behavior="side"
        ></div>
      </body>
    </Html>
  )
}
