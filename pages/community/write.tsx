import type { NextPage } from "next";
import Button from "components/button";
import Layout from "components/layout";
import TextArea from "components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Post } from "@prisma/client";
import useCoords from "libs/client/useCoords";

interface WriteForm {
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();
  const [post, { data, loading }] = useMutation<WriteResponse>("/api/posts");
  const { register, handleSubmit } = useForm<WriteForm>();
  const onValid = (formData: WriteForm) => {
    if (loading) return;
    post({ ...formData, latitude, longitude });
  };
  const router = useRouter();
  useEffect(() => {
    if (data && data.ok) router.push(`/community/${data.post.id}`);
  }, [data, router]);
  return (
    <Layout canGoBack title="Write Post">
      <form className="p-4 space-y-4" onClick={handleSubmit(onValid)}>
        <TextArea
          register={register("question", { required: true, minLength: 5 })}
          required
          placeholder="Ask a question!"
        />
        <Button text={loading ? "Loading..." : "Submit"} />
      </form>
    </Layout>
  );
};

export default Write;
