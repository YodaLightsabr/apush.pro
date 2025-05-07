import Document, { Html, Head, Main, NextScript } from "next/document";
import { CssBaseline } from '@geist-ui/core'
import { Fragment } from "react";

export default function MyDocument() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx) => {
  const initialProps = await Document.getInitialProps(ctx)
  const styles = CssBaseline.flush()

  return {
    ...initialProps,
    styles: [
      <Fragment key="1">
        {initialProps.styles}
        {styles}
      </Fragment>,
    ],
  }
}
