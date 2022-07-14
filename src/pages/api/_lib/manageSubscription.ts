import { fauna } from "services/fauna-config";
import { query as Q } from "faunadb";
import { stripe } from "services/stripe-config";

export const saveSubscription = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  const userRef = await fauna.query(
    Q.Select(
      "ref",
      Q.Get(Q.Match(Q.Index("user_by_stripe_customer_id"), customerId))
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
  };

  if (createAction) {
    // cria a inscrição
    await fauna.query(
      Q.Create(Q.Collection("subscriptions"), { data: subscriptionData })
    );
  } else {
    // atualiza a inscrição
    await fauna.query(
      Q.Replace(
        Q.Select(
          "ref",
          Q.Get(Q.Match(Q.Index("subscription_by_id"), subscriptionData.id))
        ),
        {
          data: subscriptionData,
        }
      )
    );
  }
};
