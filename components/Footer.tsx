import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black py-5">
      <div className="gap-2 flex flex-col sm:gap-0 sm:flex-row px-4 sm:px-0 sm:container sm:mx-auto items-center sm:justify-between">
        <Link href={"/"} className="text-xl font-bold text-white">
          Blogger
        </Link>
        <p className="text-white">
          Copyright {new Date().getFullYear()} Blogger
        </p>
      </div>
    </footer>
  );
}
