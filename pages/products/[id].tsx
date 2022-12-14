import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Product, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import client from "@libs/server/client";

interface IProductWithUser extends Product {
  user: User;
}

interface IItemDetailResponse {
  ok: boolean;
  product: IProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage<IItemDetailResponse> = ({
  product,
  relatedProducts,
  isLiked,
}) => {
  // const { user, isLoading } = useUser();
  const router = useRouter();
  // const { data, mutate: boundMutate } = useSWR<IItemDetailResponse>(
  //   router.query.id && `/api/products/${router.query.id}`
  // );
  // const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  // const onFavClick = () => {
  //   if (!isLiked) return;
  // boundMutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
  //   toggleFav({});
  // };
  // const { data: ttsData } = useSWR(
  //   `/api/chats?fromProduct=true&productId=${product.id}`
  // );
  return (
    <Layout canGoBack seoTitle="Product Detail">
      <div className="px-4  py-4">
        <div className="mb-8">
          {product.image ? (
            <div className="relative pb-80">
              <Image
                alt="productImg"
                src={`https://imagedelivery.net/GKiagmM6jbANrpjhvaEuYQ/${product.image}/public`}
                className="bg-white object-scale-down"
                layout="fill"
              />
            </div>
          ) : (
            <div className="h-96 bg-slate-300" />
          )}
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            {product.user.avatar ? (
              <Image
                alt={product.user.avatar}
                width={48}
                height={48}
                src={`https://imagedelivery.net/GKiagmM6jbANrpjhvaEuYQ/${product.user.avatar}/avatar`}
                className="w-12 h-12 rounded-full bg-slate-300"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-300" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">
                {product.user.name}
              </p>
              <Link href={`/users/profiles/${product.user.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <span className="text-2xl block mt-3 text-gray-900">
              ???{product.price}
            </span>
            <p className=" my-6 text-gray-700">{product.description}</p>

            <div className="flex items-center justify-between space-x-2">
              {/* {product.userId !== user?.id ? ( */}
              <Button
                large
                text="Talk to seller"
                productId={product.id}
                onClick="talktoseller"
                sellerId={product.userId}
              />
              {/* ) : !ttsData?.findtts ? (
                <span
                  className="text-center w-full bg-orange-500 hover:bg-orange-600 text-white  px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none
                  py-3 text-base"
                >
                  ????????? ????????? ??? ????????????
                </span>
              ) : (
                <Button
                  large
                  text="Talk to buyer"
                  productId={product.id}
                  onClick="talktoseller"
                  sellerId={user?.id}
                />
              )} */}
              <button
                // onClick={onFavClick}
                className={cls(
                  "p-3 rounded-md flex items-center justify-center hover:bg-gray-100",
                  isLiked
                    ? "text-red-400  hover:text-red-500"
                    : "text-gray-400  hover:text-gray-500"
                )}
              >
                {isLiked ? (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {relatedProducts.map((products) => (
              <>
                <Link href={`/products/${products.id}`}>
                  <div key={products.id}>
                    <Image
                      alt={products.image}
                      src={`https://imagedelivery.net/GKiagmM6jbANrpjhvaEuYQ/${products.image}/public`}
                      width={200}
                      height={200}
                      className="hover:cursor-pointer h-56 w-full mb-4 bg-slate-300"
                    />
                    <h3 className="hover:cursor-pointer text-gray-700 -mb-1">
                      {!relatedProducts ? "Loading..." : products.name}
                    </h3>
                    <span className="text-sm font-medium text-gray-900">
                      ${relatedProducts && products.price}
                    </span>
                  </div>
                </Link>
              </>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {},
    };
  }
  const product = await client.product.findUnique({
    where: {
      id: +ctx.params.id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });
  const isLiked = false;
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      isLiked,
    },
  };
};
export default ItemDetail;
