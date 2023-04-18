import { RichText } from "prismic-dom";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { prismicClient } from "services/prismic";
import styled from "./post.module.scss";
import Head from "next/head";

export type PostPage = {
  post: {
    slug: string;
    title: string;
    content: string;
    updateAt: string;
  };
};

const Post = ({ post }: PostPage) => {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>
      <main className={styled.container}>
        <article className={styled.post}>
          <h1>{post.title}</h1>
          <time>{post.updateAt}</time>

          <div
            className={styled.postContent}
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
        </article>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { slug } = params;
  const session = await getSession({ req });

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const prismic = prismicClient;
  const response = await prismic.getByUID("publication", slug as string);

  let mountText = "";

  response.data.content_blog.forEach((content) => {
    if (content.image_blog.url) {
      mountText = `${mountText} \n <img 
        src="${content.image_blog.url}" 
        style="width: 100%;max-width:${content.image_blog.dimensions.width}px;max-height:${content.image_blog.dimensions.height}px;object-fit:contain;" 
      />`;
    }

    content.description.forEach((description) => {
      if (description.text && description.type === "paragraph") {
        mountText = `${mountText} \n <p>${description.text}</p>`;
      }
      if (description.text && description.type === "heading1") {
        mountText = `${mountText} \n <h1>${description.text}</h1>`;
      }
      if (description.text && description.type === "heading2") {
        mountText = `${mountText} \n <h2>${description.text}</h2>`;
      }
      if (description.title && description.type === "paragraph") {
        mountText = `${mountText} \n <p>${description.title}</p>`;
      }
      if (description.title && description.type === "heading1") {
        mountText = `${mountText} \n <h1>${description.title}</h1>`;
      }
      if (description.title && description.type === "heading2") {
        mountText = `${mountText} \n <h2>${description.title}</h2>`;
      }
    });
  });

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: mountText,
    updateAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: { post },
  };
};

export default Post;
