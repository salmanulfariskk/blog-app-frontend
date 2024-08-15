'use client'

import Link from "next/link"

export default function Signup() {
  return (
    <div>
      <h1 className="text-lg font-bold mb-6 text-center">Create account</h1>
      <form>
        <div className="mb-4">
          <input
            type="text"
            className="p-2 rounded-sm border border-solid border-black block w-full outline-none"
            placeholder="Full name"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            className="p-2 rounded-sm border border-solid border-black block w-full outline-none"
            placeholder="Email"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="p-2 rounded-sm border border-solid border-black block w-full outline-none"
            placeholder="Password"
          />
        </div>
        <div className="grid">
          <button
            type="submit"
            className="p-2 rounded-sm bg-black text-white select-none text-sm font-semibold"
          >
            Sign in
          </button>
        </div>
        <div className="mt-8">
          <p>
            Have an account? <Link href={"/login"} className="hover:underline font-semibold">Log in</Link>
          </p>
        </div>
      </form>
    </div>
  )
}