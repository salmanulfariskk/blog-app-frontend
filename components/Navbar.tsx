"use client"
import { useSession } from "@/context/SessionContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";


export default function Navbar() {
  const { session } = useSession();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/logout",
        { withCredentials: true }
      );
      if (response.status === 200) {
        localStorage.removeItem("user");
        toast.success("Successfully logged out!");
        location.href="/"
      } else {
        toast.error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  
  return (
    <header className="py-5">
      <div className="flex items-center px-4 w-full sm:px-0 sm:container sm:mx-auto justify-between">
        <Link href={"/"} className="text-xl font-bold">
          Blogger
        </Link>
        <>
          {session?.isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link
                href={"/new"}
                className="flex justify-center items-center border border-solid border-black rounded-sm font-semibold px-4 py-2 select-none shadow-[-4px_4px_0px_#000000]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-label="Write"
                >
                  <path
                    fill="currentColor"
                    d="M14 4a.5.5 0 0 0 0-1zm7 6a.5.5 0 0 0-1 0zm-7-7H4v1h10zM3 4v16h1V4zm1 17h16v-1H4zm17-1V10h-1v10zm-1 1a1 1 0 0 0 1-1h-1zM3 20a1 1 0 0 0 1 1v-1zM4 3a1 1 0 0 0-1 1h1z"
                  ></path>
                  <path
                    stroke="currentColor"
                    d="m17.5 4.5-8.458 8.458a.25.25 0 0 0-.06.098l-.824 2.47a.25.25 0 0 0 .316.316l2.47-.823a.25.25 0 0 0 .098-.06L19.5 6.5m-2-2 2.323-2.323a.25.25 0 0 1 .354 0l1.646 1.646a.25.25 0 0 1 0 .354L19.5 6.5m-2-2 2 2"
                  ></path>
                </svg>
                <span className="ml-2">Write</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex justify-center items-center border border-solid border-black rounded-sm font-semibold px-10 py-2 select-none shadow-[-4px_4px_0px_#000000]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href={"/login"}
              className="flex justify-center items-center border border-solid border-black rounded-sm font-semibold px-10 py-2 select-none shadow-[-4px_4px_0px_#000000]"
            >
              Sign in
            </Link>
          )}
        </>
      </div>
    </header>
  );
}
