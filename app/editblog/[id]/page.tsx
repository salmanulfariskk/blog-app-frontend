"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

type Props = {
  params: { id: string };
};

type BlogPost = {
  title: string;
  content: string;
  photo: string;
};

type Blog = {
  post: BlogPost;
};

export default function EditBlog({ params }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { isLoading, data: blog } = useQuery<Blog, Error>({
    queryKey: ["blog", params.id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/api/blogs/${params.id}`, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.post) {
        setTitle(data.post.title || "");
        setContent(data.post.content || "");
      }
    },
  });

  useEffect(() => {
    if (blog && blog.post) {
      setTitle(blog.post.title || "");
      setContent(blog.post.content || "");
    }
  }, [blog]);

  const updateBlogMutation = useMutation<void, Error>({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (photoFile) {
        formData.append("photo", photoFile); // Use "photo" as the key
      }
  
      await axios.put(
        `http://localhost:5000/api/blogs/${params.id}`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["blog", params.id]);
      toast.success('Blog updated successfully!');
      setTimeout(() => router.push('/'), 2000); // Redirect after 2 seconds
    },
    onError: (err: Error) => {
      console.error("Error updating post:", err);
      const errorMessage = err.response?.data?.message || 'Failed to update blog.';
      toast.error(errorMessage);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    } else {
      console.error("Please upload a valid image file.");
    }
  };

  return (
    <div className="px-4 sm:px-0 sm:container sm:mx-auto">
      <div className="text-center my-24 max-w-[750px] mx-auto">
        <h1 className="text-2xl sm:text-5xl tracking-tight font-bold">
          Edit Blog
        </h1>
      </div>
      <div className="mx-auto mb-10 max-w-[800px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateBlogMutation.mutate();
          }}
        >
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-sm border-black border border-solid px-2 py-[9px]"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-semibold mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-sm border-black border border-solid px-2 py-[9px] resize-none"
              rows={6}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="photo" className="block text-sm font-semibold mb-2">
              Change Photo
            </label>
            <input
              type="file"
              id="photo"
              onChange={handleFileChange}
              className="w-full rounded-sm border-black border border-solid px-2 py-[9px]"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-10 bg-black py-2 rounded-sm text-sm font-semibold text-white select-none"
            >
              Update
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
