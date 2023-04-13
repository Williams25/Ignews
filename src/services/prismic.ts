// import Prismic from "@prismicio/client";

// export const getPrismicClient = () => {
//   const prismic = Prismic.createClient(process.env.PRISMIC_ACCESS_TOKEN, {
//     accessToken: process.env.PRISMIC_ACCESS_TOKEN,
//   });

//   return prismic;
// };

import * as prismic from "@prismicio/client";

export const repositoryName = "ignewswilliams25";

export const prismicClient = prismic.createClient(repositoryName, {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
});
