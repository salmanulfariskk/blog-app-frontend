"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Updated import
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function New() {
  const router = useRouter(); // This now works with the app directory
  const [values, setValues] = useState<{
    title: string;
    content: string;
    image: {
      preview: string;
      file: File | null;
    };
  }>({
    title: "",
    content: "",
    image: {
      preview: "",
      file: null,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      throw new Error("Please upload a file");
    }

    setValues((prev) => ({
      ...prev,
      image: {
        preview: URL.createObjectURL(file),
        file: file,
      },
    }));
  };

  const { mutate: createPost } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      for (const key in values) {
        if (key === "image") {
          if (values.image.file) {
            formData.append("file", values.image.file);
            continue;
          }
        } else {
          formData.append(key, values[key as keyof typeof values] as string);
        }
      }

      await axios.post("http://localhost:5000/api/blogs", formData, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      toast.success("Post created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        router.push("/"); // This now works correctly
      }, 3000);
    },
    onError: (error) => {
      toast.error("Failed to create post. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPost();
  };

  return (
    <div className="mt-4 px-4 sm:px-0 sm:container sm:mx-auto min-h-[calc(100vh-166px)]">
      <div className="max-w-[750px] mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create post</h1>

        <form method="POST" onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={values.title}
              onChange={handleChange}
              className="h-10 rounded-sm border border-solid border-black text-sm outline-none block w-full px-2"
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Content"
              rows={6}
              name="content"
              value={values.content}
              onChange={handleChange}
              className="rounded-sm border border-solid border-black text-sm resize-none outline-none block w-full p-2"
            />
          </div>
          <div className="mb-4">
            {values.image.preview ? (
              <Image
                src={values.image.preview}
                alt="preview"
                width={1920}
                height={1080}
              />
            ) : (
              <input
                type="file"
                placeholder="Title"
                onChange={handleFileChange}
                className="h-10 rounded-sm border border-solid border-black text-sm outline-none block w-full px-2 py-2 file:bg-transparent file:border-none"
              />
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-10 py-3 rounded-sm bg-black flex items-center justify-center text-white text-sm font-semibold select-none transition-colors hover:bg-black/90 mb-10"
            >
              Post
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}
