import styled from "./button.module.scss";

export type SubscribeButtonProps = {
  priceId: string;
};

export const SubscribeButton = ({ priceId }: SubscribeButtonProps) => {
  return (
    <button type="button" className={styled.subscribeButton}>
      Subscribe now
    </button>
  );
};
