import Image from "next/image";
import Link from "next/link";

type Props = {
  _id: string;
  title: string;
  content: string;
  photo: string;
  createdAt: string;
  author: {
    name: string;
  };
};

export default function Card({
  _id,
  title,
  content,
  photo,
  createdAt,
  author,
}: Props) {
  return (
    <article className="relative group mb-4 sm:mb-0 h-full">
      <div className="w-1 absolute left-0 bottom-0 top-0 bg-black rounded-tl-sm rounded-bl-sm scale-x-0 transition-transform group-hover:scale-x-100 group-hover:delay-75" />
      <div className="h-1 absolute bottom-0 left-0 right-0 bg-black rounded-br-sm scale-y-0 rounded-bl-sm transition-transform group-hover:scale-y-100 group-hover:delay-75" />

      <div className="h-full flex flex-col bg-white border border-solid border-black rounded-sm overflow-hidden transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:delay-75">
        <Link href={`/blogs/${_id}`} className="relative flex">
          <div className="w-full pb-[56.25%]" />
          <Image
            src={photo}
            alt=""
            fill
            className="absolute top-0 left-0 w-full h-full object-cover bg-gray-400"
          />
        </Link>
        <div className="p-4 h-full flex flex-col">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 tracking-tight">
            <Link href={"/blogs/671111321fasdfsdg"}>{title}</Link>
          </h3>
          <div className="flex items-center mb-2">
            <span
              dir="auto"
              className="block max-w-full break-words text-xs text-gray-700"
            >
              by <strong className="font-semibold">{author.name}</strong>
            </span>
            <span
              dir="auto"
              className="inline-block max-w-full break-words text-sm text-gray-700 mx-1"
            >
              •
            </span>
            <Link href={`/blogs/${_id}`}>
              <span
                dir="auto"
                className="block max-w-full break-words text-xs text-gray-700"
              >
                <time>{createdAt}</time>
              </span>
            </Link>
          </div>
          <p className="mb-3 text-sm text-gray-700 tracking-tight">
            {content.length > 91 ? content.substring(0, 91) + "..." : content}
          </p>
          <Link href={`/blogs/${_id}`} className="btn mt-auto">
            Read more
          </Link>
        </div>
      </div>
    </article>
  );
}
