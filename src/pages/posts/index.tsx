import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { prismicClient } from "services/prismic";
import styled from "./posts.module.scss";

type PostsProps = {
  id: string;
  uid: string;
  url: string | null;
  type: string;
  href: string;
  tags: string[];
  first_publication_date: string;
  updateAt: string;
  last_publication_date: string;
  slugs: string[];
  linked_documents: [];
  lang: string;
  alternate_languages: string[];
  data: {
    title: {
      type: string;
      text: string;
    }[];
    content: {
      type: string;
      text: string;
    }[];
    content_blog: {
      image_blog: {
        url: string;
      };
      description: {
        type: string;
        text: string;
      }[];
    }[];
  };
};

type PostsPageProps = {
  posts: PostsProps[];
};

const Posts = ({ posts }: PostsPageProps) => {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styled.container}>
        <div className={styled.posts}>
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.slugs[0]}`}>
              <a>
                <time>{post.updateAt}</time>
                <strong>{post.data.title[0].text}</strong>
                <p>{post.data.content_blog[0].description[0].text}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<PostsPageProps> = async () => {
  const response = await prismicClient.getByType("publication");
  const posts = response.results.map((post) => ({
    ...post,
    updateAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  }));

  return {
    props: {
      posts: posts as unknown as PostsProps[],
    },
  };
};

export default Posts;
