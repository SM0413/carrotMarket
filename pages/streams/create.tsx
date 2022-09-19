import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";
import useSWR from "swr";

interface ICreateStream {
  name: string;
  price: number;
  description: string;
  formErrors?: string;
}

interface ICreateResponse {
  ok: boolean;
  stream: Stream;
}

interface IApiResult {
  isInput: boolean;
  live: boolean;
  status: string;
  videoUID: string;
}
const Create: NextPage = () => {
  const router = useRouter();
  const [createLive, { data, loading }] =
    useMutation<ICreateResponse>(`/api/streams`);
  const { register, handleSubmit } = useForm<ICreateStream>();
  const onValid = (form: ICreateStream) => {
    if (loading) return;
    createLive(form);
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/streams/${data.stream.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Go Live">
      <form onSubmit={handleSubmit(onValid)} className=" space-y-4 py-10 px-4">
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true, valueAsNumber: true })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          required
          name="description"
          label="Description"
        />
        <Button text={loading ? "Loading..." : "Go live"} />
      </form>
    </Layout>
  );
};

export default Create;
