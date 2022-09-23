import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useSWR from "swr";
import { Message, Product, TalkToSeller } from "@prisma/client";
import Image from "next/image";
import useUser from "@libs/client/useUser";
interface IWithProductAndMessge extends TalkToSeller {
  messages: Message[];
  product: Product;
}

interface IChatsResponse {
  AllChats: IWithProductAndMessge[];
}

const Chats: NextPage = () => {
  const { user } = useUser();
  const { data } = useSWR<IChatsResponse>(`/api/chats`);
  return (
    <Layout hasTabBar title="채팅" seoTitle="채팅">
      <div className="divide-y-[1px] ">
        {data?.AllChats?.map((chat, index) => (
          <Link
            href={{
              pathname: `/chats/[id]`,
              query: {
                sellerId: chat.product.userId,
              },
            }}
            as={`/chats/${chat.productId}`}
            key={index}
          >
            <a className="flex px-4 cursor-pointer py-3 items-center space-x-3">
              <Image
                alt={`${chat.product.image}`}
                width={50}
                height={50}
                src={`https://imagedelivery.net/GKiagmM6jbANrpjhvaEuYQ/${chat.product.image}/public`}
                className="w-12 h-12 rounded-full bg-slate-300"
              />
              <div>
                <p className="text-gray-700">{chat.product.name}</p>
                <p className="text-sm  text-gray-500">
                  {chat.messages.slice(-1).map((message) => message.message)}
                </p>
              </div>
              {chat.isbuy && chat.issold && !chat.isSell && (
                <div className="text-center text-gray-500">
                  <p>구매 결정이 완료된 상품</p>
                </div>
              )}
              {chat.isbuy && chat.issold && chat.isSell && (
                <div className="text-center text-gray-500">
                  <p>거래가 완료된 상품</p>
                </div>
              )}

              {chat.createdSellerId === user?.id && chat.issold && !chat.isbuy && (
                <div className="text-center text-red-500">
                  <p>상대방이 구매예약 상태가 아닙니다</p>
                </div>
              )}
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
