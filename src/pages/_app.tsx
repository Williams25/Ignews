import { Header } from "components/Header";
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/global.scss";
import { SessionProvider } from "next-auth/react";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Home | ig.news</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
