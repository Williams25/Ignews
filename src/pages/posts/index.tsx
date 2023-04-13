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
            <Link key={post.id} href={`post/${post.slugs[0]}`}>
              <a>
                <time>{post.first_publication_date}</time>
                <strong>{post.data.title[0].text}</strong>
                <p>{post.data.content_blog[0].description[0].text}</p>
              </a>
            </Link>
          ))}

          <Link href="#">
            <a>
              <time>12 de março</time>
              <strong>Title</strong>
              <p>desc</p>
            </a>
          </Link>

          <Link href="#">
            <a>
              <time>12 de março</time>
              <strong>Title</strong>
              <p>desc</p>
            </a>
          </Link>
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<PostsPageProps> = async () => {
  const response = await prismicClient.getByType("publication");

  return {
    props: {
      posts: response.results as unknown as PostsProps[],
    },
  };
};

export default Posts;
