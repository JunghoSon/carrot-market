import { readdirSync } from "fs";
import { GetStaticProps, NextPage } from "next";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import Layout from "@components/layout";

const Post: NextPage<{ post: string }> = ({ post }) => {
  return (
    <Layout>
      <div
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: post }}
      />
    </Layout>
  );
};

export function getStaticPaths() {
  const files = readdirSync("./posts").map((file) => {
    const [name] = file.split(".");
    return {
      params: {
        slug: name,
      },
    };
  });
  return {
    // paths: files,
    // fallback: false,
    paths: [],
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { content } = matter.read(`./posts/${ctx.params?.slug}.md`);
  console.log(content);
  const { value } = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);
  return {
    props: {
      post: value,
    },
  };
};

export default Post;
