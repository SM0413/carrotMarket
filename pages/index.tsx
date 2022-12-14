import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import Head from "next/head";
import useSWR, { SWRConfig } from "swr";
import { Product } from "@prisma/client";
import client from "@libs/server/client";
import useUser from "@libs/client/useUser";

export interface ProductWithCount extends Product {
  _count: {
    fav: number;
    talktoseller: number;
  };
}
interface IProductResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const { data } = useSWR<IProductResponse>("/api/products");
  return (
    <Layout title="홈" hasTabBar seoTitle="Home">
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 divide-y">
        {data?.products?.map((product) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            photo={product.image}
            comments={product._count?.talktoseller || 0}
            hearts={product._count?.fav || 0}
          />
        ))}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

const Page: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
  useUser();
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/products": {
            ok: true,
            products,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};

export async function getServerSideProps() {
  const products = await client.product.findMany({});
  return {
    props: { products: JSON.parse(JSON.stringify(products)) },
  };
}

export default Page;
