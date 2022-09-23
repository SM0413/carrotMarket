import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { Stream } from "@prisma/client";
import useUser from "@libs/client/useUser";
import { useEffect, useRef, useState } from "react";
import streams from "pages/api/streams";

interface IStreamMessage {
  message: string;
  id: number;
  user: {
    avatar?: string;
    id: number;
  };
}

interface IStreamWithMessage extends Stream {
  messages: IStreamMessage[];
}

interface IStreamResponse {
  ok: boolean;
  stream: IStreamWithMessage;
}

interface IMessageForm {
  message: string;
}

interface IUpdateCoverIMG {
  ok: boolean;
}

const Streame: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<IMessageForm>();

  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, mutate } = useSWR<IStreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    { refreshInterval: 1000 }
  );

  const [sendMessage, { data: sendMessageData, loading }] = useMutation(
    `/api/streams/${router.query.id}/messages`
  );
  const onValid = (form: IMessageForm) => {
    if (loading) return;
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            messages: [
              ...prev.stream.messages,
              { id: Date.now(), message: form.message, user: { ...user } },
            ],
          },
        } as any),
      false
    );
    sendMessage(form);
    reset();
  };
  const [uploadDatas, { data: uploadData, loading: uploadLoading }] =
    useMutation<IUpdateCoverIMG>(`/api/streams/img`);
  const [isUploadCoverImg, setIsUploadCoverImg] = useState(false);
  const ClickUploadCoverIMG = () => {
    setIsUploadCoverImg(true);
    uploadDatas(router.query);
  };

  useEffect(() => {
    if (sendMessageData && sendMessageData.ok) {
      scrollRef?.current?.scrollIntoView();
    }
  }, [sendMessageData, mutate]);
  return (
    <Layout canGoBack seoTitle="스트리밍">
      <div className="py-10 px-4  space-y-4">
        {!isUploadCoverImg ? (
          <span
            onClick={ClickUploadCoverIMG}
            className="font-mono mb-0 hover:cursor-pointer"
          >
            썸네일 업로드
          </span>
        ) : (
          <span
            onClick={ClickUploadCoverIMG}
            className="font-mono mb-0 hover:cursor-pointer"
          >
            썸네일 재 업로드
          </span>
        )}
        {data?.stream.cloudflareId ? (
          <iframe
            className="w-full aspect-video  rounded-md shadow-sm"
            src={`https://iframe.videodelivery.net/${data?.stream.cloudflareId}`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
          ></iframe>
        ) : null}
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data ? data?.stream.name : "Loading..."}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">
            ${data && data.stream.price}
          </span>

          <p className=" my-6 text-gray-700">
            {data ? data?.stream.description : "Loading..."}
          </p>
        </div>
        {data?.stream.userId === user?.id && (
          <div className="flex flex-col space-y-2 bg-orange-300 rounded-md px-5 overflow-scroll">
            <span className="font-medium">Stream Keys(secret)</span>

            <span className="font-medium">CloudFlareURL⤵️</span>
            {data?.stream.cloudflareURL}
            <span className="font-medium">CloudFlareKey⤵️</span>
            {data?.stream.cloudflareKey}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            {data?.stream.messages.map((message) => (
              <Message
                key={message.id}
                message={message.message}
                reversed={message.user.id === user?.id}
              />
            ))}
            <div ref={scrollRef} />
          </div>
          <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex relative max-w-md items-center  w-full mx-auto"
            >
              <input
                type="text"
                {...register("message", { required: true, minLength: 1 })}
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Streame;
