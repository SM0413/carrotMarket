import Layout from "@components/layout";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";

interface IPost {
  title: string;
  date: string;
  category: string;
}
const Blog: NextPage<{ posts: IPost[] }> = ({ posts }) => {
  return (
    <Layout title="Blog" seoTitle="Blog">
      <h1 className="font-serif text-lg text-center justify-center">
        Latest Posts:
      </h1>
      {posts?.map((post, index) => (
        <div key={index} className="my-4 justify-center text-center">
          <span>
            <strong>{post.title}</strong>
          </span>
          <div>
            <span className="text-gray-400">
              {post.date} / {post.category}
            </span>
          </div>
        </div>
      ))}
    </Layout>
  );
};

export async function getStaticProps() {
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    return matter(content).data;
  });
  return {
    props: { posts: blogPosts },
  };
}

export default Blog;
