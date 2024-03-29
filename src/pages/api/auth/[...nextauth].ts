import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { fauna } from "services/fauna-config";
import { query as Q } from "faunadb";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
  ],

  callbacks: {
    session: async ({ session }) => {
      try {
        const userActiveSubscription = await fauna.query(
          Q.Get(
            Q.Intersection([
              Q.Match(
                Q.Index("subscription_by_user_ref"),
                Q.Select(
                  "ref",
                  Q.Get(
                    Q.Match(
                      Q.Index("user_by_email"),
                      Q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              Q.Match(Q.Index("subscription_by_status"), "active"),
            ])
          )
        );

        return { ...session, activeSubscription: !!userActiveSubscription };
      } catch (error) {
        console.error(error);
        return { ...session, activeSubscription: null };
      }
    },
    signIn: async ({ account, user, profile }) => {
      try {
        if (!user?.email)
          throw new Error(`User ${user.name}, add public mail.`);
        await fauna.query(
          Q.If(
            Q.Not(
              Q.Exists(
                Q.Match(Q.Index("user_by_email"), Q.Casefold(user.email))
              )
            ),
            Q.Create(Q.Collection("users"), {
              data: { email: user?.email },
            }),
            Q.Get(Q.Match(Q.Index("user_by_email"), Q.Casefold(user.email)))
          )
        );

        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
  },
});
