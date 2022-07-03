import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/global.scss";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ignews</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
