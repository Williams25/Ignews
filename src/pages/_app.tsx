import { Header } from "components/Header";
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/global.scss";
import { SessionProvider } from "next-auth/react";
import { PrismicProvider } from "@prismicio/react";
import { prismicClient } from "services/prismic";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <PrismicProvider client={prismicClient}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Home | ig.news</title>
        </Head>
        <Header />
        <Component {...pageProps} />
      </PrismicProvider>
    </SessionProvider>
  );
};

export default App;
