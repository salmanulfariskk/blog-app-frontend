"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function Signup() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong.");
      }

      toast.success("Successfully registered!");
      router.push("/login");
    } catch (err: any) {
      toast.error("Failed to register. Please try again.");
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h1 className="text-lg font-bold mb-6 text-center">Create account</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            className="p-2 rounded-sm border border-solid border-black block w-full outline-none"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            className="p-2 rounded-sm border border-solid border-black block w-full outline-none"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            className="p-2 rounded-sm border border-solid border-black block w-full outline-none"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid">
          <button
            type="submit"
            className="p-2 rounded-sm bg-black text-white select-none text-sm font-semibold"
          >
            Sign up
          </button>
        </div>
        {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
        <div className="mt-8">
          <p>
            Have an account?{" "}
            <Link href={"/login"} className="hover:underline font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
