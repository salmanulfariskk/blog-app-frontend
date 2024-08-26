"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

type Props = {
  params: { id: string };
};

type Blog = {
  post?: {
    title?: string;
    author?: {
      name?: string;
      email?: string;
    };
    photo?: string;
    content?: string;
  };
  commentCount?: number;
  comments?: Array<{
    _id: string;
    author?: {
      name?: string;
    };
    content?: string;
  }>;
};

export default function SingleBlog({ params }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter(); // Initialize useRouter
  const { isLoading, data: blog } = useQuery<Blog>({
    queryKey: ["blog", params.id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/api/blogs/${params.id}`
      );
      return res.data;
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`http://localhost:5000/api/blogs/${params.id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      router.push("/"); // Redirect to home or another page after deletion
    },
    onError: (err) => {
      console.error("Error deleting post:", err);
    },
  });

  const handleEdit = () => {
    router.push(`/editblog/${params.id}`); // Redirect to the edit page
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate();
    }
  };

  if (isLoading) return "loading...";

  const userEmail = JSON.parse(localStorage.getItem("user") || "{}").email;
  const blogEmail = blog?.post?.author?.email;

  if (isLoading) return "loading...";

  return (
    <div className="px-4 sm:px-0 sm:container sm:mx-auto">
      <div className="text-center my-24 max-w-[750px] mx-auto">
        <h1 className="text-2xl sm:text-5xl tracking-tight font-bold">
          {blog?.post?.title}
        </h1>
        <Link
          href={"/"}
          className="relative mx-auto mt-6 w-16 flex items-center justify-center bg-gray-200 text-sm font-bold h-16 rounded-full"
        >
          {blog?.post?.author?.name?.substring(0, 1)}
        </Link>
        <p className="mt-1 pb-2 text-lg max-w-[750px] mx-auto font-bold">
          {blog?.post?.author?.name}
        </p>
        {blogEmail === userEmail && (
          <div className="mt-4">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Edit Blog
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Delete Blog
            </button>
          </div>
        )}
      </div>
      <div className="mx-auto mb-10 max-w-[800px] -mt-[56px]">
        <picture className="block relative">
          <div className="w-full pb-[56.25%]" />
          <Image
            src={blog?.post?.photo || ""}
            alt=""
            fill
            className="object-cover"
          />
        </picture>
        <div className="mt-4">
          <p>{blog?.post?.content}</p>
        </div>
      </div>
      <div className="max-w-[800px] mx-auto pb-10">
        <hr className="my-6 border-t border-solid border-t-black/10" />
        <h3 className="text-xl font-bold mb-6">
          {blog?.commentCount} Comments
        </h3>
        <CreateCommentForm postId={params.id} />
        <div className="mt-3">
          {blog?.commentCount && blog.commentCount > 0
            ? blog.comments?.map((comment) => (
                <div key={comment._id} className="flex items-start mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex text-sm font-bold items-center justify-center relative mr-4 flex-shrink-0 select-none">
                    {comment.author?.name?.substring(0, 1)}
                  </div>
                  <div className="flex-grow flex-shrink">
                    <h3 className="text-sm font-semibold my-auto">
                      {comment.author?.name}
                    </h3>
                    <p className="pt-[2px] text-sm text-gray-700">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            : "No comments on this Blog"}
        </div>
      </div>
    </div>
  );
}

type CreateCommentData = {
  text: string;
};

function CreateCommentForm({ postId }: { postId: string }) {
  const [text, setText] = useState<string>("");
  const queryClient = useQueryClient();

  const { isPending, mutate: handleCreateComment } = useMutation({
    mutationFn: async (newComment: CreateCommentData) => {
      const res = await axios.post(
        "http://localhost:5000/api/comments",
        {
          ...newComment,
          postId,
        },
        { withCredentials: true }
      );
      return res.data;
    },
    onMutate: async (newComment: CreateCommentData) => {
      // Optimistically update the cache with the new comment
      await queryClient.cancelQueries({ queryKey: ["blog", postId] });
      const previousBlogData = queryClient.getQueryData<Blog>(["blog", postId]);

      queryClient.setQueryData<Blog>(["blog", postId], (oldData) => ({
        ...oldData,
        commentCount: (oldData?.commentCount ?? 0) + 1,
        comments: [
          ...(oldData?.comments ?? []),
          {
            _id: new Date().getTime().toString(),
            author: { name: "You" },
            content: newComment.text,
          }, // Dummy comment data
        ],
      }));

      return { previousBlogData };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(["blog", postId], context?.previousBlogData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", postId] });
    },
  });

  return (
    <div className="flex items-start">
      <div className="w-10 relative mr-4 flex-shrink-0">
        <div className="w-full pb-[100%]" />
        <Image
          src={
            "https://www.ryrob.com/wp-content/uploads/2021/07/10-Blog-Post-Templates-to-Download-Free-SEO-Driven-Template.jpg"
          }
          alt=""
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-grow flex-shrink">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateComment({ text });
            setText("");
          }}
        >
          <textarea
            className="w-full rounded-sm border-black border border-solid h-10 outline-none resize-none text-sm px-2 py-[9px]"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              disabled={isPending}
              type="submit"
              className="px-10 flex bg-black py-2 rounded-sm text-sm font-semibold text-white select-none items-center justify-center"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
