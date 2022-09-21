import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";

interface IUploadProductForm {
  name: string;
  price: number;
  description: string;
  photo: FileList;
}

interface IUploadProductMutation {
  ok: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  const router = useRouter();
  const [useStateLoading, setStateLoading] = useState(false);
  const { register, handleSubmit, watch } = useForm<IUploadProductForm>();
  const [uploadProduct, { loading, data }] =
    useMutation<IUploadProductMutation>("/api/products");
  useEffect(() => {
    if (data?.ok) {
      router.replace(`/products/${data.product.id}`);
    }
  }, [data, router]);
  const onValid = async (data: IUploadProductForm) => {
    if (loading) return;
    setStateLoading(true);
    if (data.photo && data.photo.length > 0) {
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      const form = new FormData();
      form.append("file", data.photo[0], data.name);
      const {
        result: { id },
      } = await (await fetch(uploadURL, { method: "POST", body: form })).json();
      uploadProduct({ ...data, photoId: id });
      setStateLoading(false);
    } else {
      uploadProduct(data);
      setStateLoading(false);
    }
  };
  const [photoPreview, setPhotoPreview] = useState("");
  const photo = watch("photo");
  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo]);
  return (
    <Layout canGoBack title="Upload Product">
      <form onSubmit={handleSubmit(onValid)} className="p-4 space-y-4">
        <div>
          {photoPreview ? (
            <img
              src={photoPreview}
              className="w-fulltext-gray-600  items-center justify-center h-46 rounded-md aspect-video"
            />
          ) : (
            <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                {...register("photo")}
                accept="image/*"
                className="hidden"
                type="file"
              />
            </label>
          )}
        </div>
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true })}
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
        <Button
          text={
            useStateLoading
              ? "Loading..."
              : loading
              ? "Loading..."
              : "Upload item"
          }
        />
      </form>
    </Layout>
  );
};

export default Upload;
