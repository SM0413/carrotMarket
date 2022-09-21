import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { TalkToSeller } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import Preview from "twilio/lib/rest/Preview";
import useUser from "@libs/client/useUser";
import { useEffect, useRef, useState } from "react";

interface IMEssage {
  message: string;
  id: number;
  user: {
    avatar?: string;
    id: number;
  };
}

interface ITalkToSellerWithMessage extends TalkToSeller {
  messages: IMEssage[];
}

interface ICreateTalkToSeller {
  ok: boolean;
  findTalkToSellerUniq: ITalkToSellerWithMessage;
}

interface IForm {
  message: string;
}
interface IBuy {
  ok: boolean;
}

const ChatDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();

  const [setBuy, { loading: buyLoading }] = useMutation<IBuy>(
    `/api/chats/${router.query.id}/buy`
  );

  const { data, mutate } = useSWR<ICreateTalkToSeller>(
    router.query.id
      ? `/api/chats/${router.query.id}?productId=${router.query.productId}&sellerId=${router.query.sellerId}`
      : null
  );

  const ClickBuy = () => {
    if (data?.findTalkToSellerUniq.createdBuyerId === user?.id) {
      setBuy({
        buyorsold:
          data?.findTalkToSellerUniq.isbuy === null
            ? true
            : !data?.findTalkToSellerUniq.isbuy,
        ttsId: data?.findTalkToSellerUniq.id,
        isBuyer: true,
      });
    } else if (data?.findTalkToSellerUniq.createdSellerId === user?.id) {
      setBuy({
        buyorsold:
          data?.findTalkToSellerUniq.issold === null
            ? true
            : !data?.findTalkToSellerUniq.issold,
        ttsId: data?.findTalkToSellerUniq.id,
        isBuyer: false,
      });
    }
  };
  const [sendMessage, { loading, data: sendMessageData }] = useMutation(
    `/api/chats/${router.query.id}/message?talktosellerid=${data?.findTalkToSellerUniq?.id}`
  );
  const { register, handleSubmit, reset } = useForm<IForm>();
  const onValid = (form: IForm) => {
    if (form.message.length < 1) return;
    if (loading) return;
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          findTalkToSellerUniq: {
            ...prev.findTalkToSellerUniq,
            messages: [
              ...prev?.findTalkToSellerUniq?.messages,
              { id: Date.now(), message: form.message, user: { ...user } },
            ],
          },
        } as any),
      false
    );
    sendMessage(form);
    reset();
  };
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (sendMessageData && sendMessageData.ok) {
      scrollRef?.current?.scrollIntoView();
    }
  }, [sendMessageData, mutate]);
  return (
    <Layout canGoBack title="채팅">
      {data?.findTalkToSellerUniq.isbuy && data?.findTalkToSellerUniq.issold && (
        <div className="fixed z-10 flex rounded-md max-w-xl h-10 justify-center items-center  w-full  bg-white">
          <span> 판매가 완료 된 상품입니다.</span>
        </div>
      )}
      {data?.findTalkToSellerUniq.isbuy && !data?.findTalkToSellerUniq.issold && (
        <div className="fixed z-10 flex rounded-md max-w-xl h-10 justify-center items-center  w-full  bg-white">
          <span> 구매예약이 된 상품입니다.</span>
        </div>
      )}
      {data?.findTalkToSellerUniq.createdSellerId === user?.id &&
        !data?.findTalkToSellerUniq.isbuy &&
        data?.findTalkToSellerUniq.issold && (
          <div className="fixed z-10 flex rounded-md max-w-xl h-10 justify-center items-center  w-full  bg-white">
            <span> 상대방이 구매예약 상태가 아닙니다.</span>
          </div>
        )}
      <div className="py-10 pb-16 px-4 space-y-4">
        {data?.findTalkToSellerUniq?.messages?.map((message, index) => (
          <Message
            key={index}
            avatarUrl={message.user.avatar}
            message={message.message}
            reversed={user?.id === message.user.id ? true : false}
          />
        ))}
        <div
          onClick={ClickBuy}
          className="hover:cursor-pointer flex rounded-md relative max-w-md h-10 justify-center items-center  w-full mx-auto bg-orange-400"
        >
          {data?.findTalkToSellerUniq?.createdBuyerId === user?.id && (
            <span>
              {data?.findTalkToSellerUniq.isbuy ? "예약 취소" : "구매 예약"}
            </span>
          )}
          {data?.findTalkToSellerUniq.createdSellerId === user?.id && (
            <span>
              {!data?.findTalkToSellerUniq.isbuy &&
                data?.findTalkToSellerUniq.issold &&
                "판매 취소"}
              {data?.findTalkToSellerUniq.isbuy &&
                data?.findTalkToSellerUniq.issold &&
                "판매 취소"}
              {data?.findTalkToSellerUniq.isbuy &&
                !data?.findTalkToSellerUniq.issold &&
                "판매 확정"}
              {!data?.findTalkToSellerUniq.isbuy &&
                !data?.findTalkToSellerUniq.issold &&
                "판매 확정"}
            </span>
          )}
        </div>
        <form
          onSubmit={handleSubmit(onValid)}
          className="fixed py-2 bg-white  bottom-0 inset-x-0"
        >
          <div className="flex relative max-w-md items-center  w-full mx-auto">
            <input
              {...register("message")}
              type="text"
              className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              required
            />
            <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
              <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                &rarr;
              </button>
            </div>
          </div>
        </form>
        <div ref={scrollRef} />
      </div>
    </Layout>
  );
};

export default ChatDetail;
