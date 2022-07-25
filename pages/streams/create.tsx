import type { NextPage } from "next";
import Button from "components/button";
import Input from "components/input";
import Layout from "components/layout";
import TextArea from "components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";

interface CreateForm {
  name: string;
  price: string;
  description: string;
}

interface CreateResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const { register, handleSubmit } = useForm<CreateForm>();
  const [createStream, { data, loading }] =
    useMutation<CreateResponse>("/api/streams");
  const onValid = (formData: CreateForm) => {
    if (loading) return;
    createStream(formData);
  };

  const router = useRouter();

  useEffect(() => {
    if (data && data.ok) router.push(`/streams/${data.stream.id}`);
  }, [data, router]);
  return (
    <Layout canGoBack title="Go Live">
      <form className=" space-y-4 py-10 px-4" onSubmit={handleSubmit(onValid)}>
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
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="Description"
        />
        <Button text={loading ? "Loading..." : "Go live"} />
      </form>
    </Layout>
  );
};

export default Create;