import type { GetStaticProps } from "next";
import { SubscribeButton } from "components/SubscribeButton";
import Image from "next/image";
import styled from "../styles/home.module.scss";
import { stripe } from "services/stripe-config";

type HomePageProps = {
  product: {
    priceId: string;
    amount: string;
  };
};

const Home = ({ product }: HomePageProps) => {
  return (
    <main className={styled.contentContainer}>
      <section className={styled.hero}>
        <span>👋 Hey, welcome</span>
        <h1>
          News about the <span>React</span> world.
        </h1>
        <p>
          Get acess to all the publications
          <br />
          <span>for {product.amount} month</span>
        </p>

        <SubscribeButton priceId={product.priceId} />
      </section>

      <Image
        src="/images/avatar.svg"
        alt="girl coding"
        width={400}
        height={400}
      />
    </main>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const price = await stripe.prices.retrieve("price_1LIKs6CbwSLLk6RGKtKFoSGm");

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      currency: "USD",
      style: "currency",
    }).format(price.unit_amount / 100),
  };

  return {
    props: { product },
    revalidate: 60 * 60 * 24, // 24hrs
  };
};

export default Home;
