import { useSession, signIn } from "next-auth/react";
import { api } from "services/api";
import { getStripeJS } from "services/stripe-js";
import styled from "./button.module.scss";

export type SubscribeButtonProps = {
  priceId: string;
};

export const SubscribeButton = ({ priceId }: SubscribeButtonProps) => {
  const { data: session } = useSession();

  const handleSubscribe = async () => {
    if (!session) {
      signIn("github");
      return;
    }

    try {
      const { data: res } = await api.post("subscribe", { price: priceId });
      const sessionId = res.sessionId;

      const { redirectToCheckout } = await getStripeJS();
      await redirectToCheckout({
        sessionId,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <button
      type="button"
      className={styled.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
};
