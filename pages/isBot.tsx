import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import Head from "next/head";
import useSWR from "swr";
import { Fav, Product } from "@prisma/client";

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

const IsBot: NextPage = () => {
  return (
    <div className="flex justify-center text-center text-2xl">
      <span>Plz don&apos;t be Bot, Be humen</span>
    </div>
  );
};

export default IsBot;
