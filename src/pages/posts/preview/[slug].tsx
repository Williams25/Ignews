import { RichText } from "prismic-dom";
import type { GetStaticProps, GetStaticPaths } from "next";
import { prismicClient } from "services/prismic";
import styled from "../post.module.scss";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export type PostPreviewPage = {
  post: {
    slug: string;
    title: string;
    content: string;
    updateAt: string;
  };
};

const PostPreview = ({ post }: PostPreviewPage) => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.data && session?.data["activeSubscription"]) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session, post, router]);

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
            className={`${styled.postContent} ${styled.previewContent}`}
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />

          <div className={styled.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 😎</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await prismicClient.getByType("publication");
  const posts = response?.results?.map((post) => ({
    params: { slug: post.slugs[0] },
  }));

  return {
    paths: posts,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = prismicClient;
  const response = await prismic.getByUID("publication", slug as string);

  let mountText = "";

  response.data.content_blog.forEach((content, index) => {
    if (index < 1) {
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
    }
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
    revalidate: 60 * 30, // 30 min
  };
};

export default PostPreview;
