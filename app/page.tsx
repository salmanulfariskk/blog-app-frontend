"use client";
import Card from "@/components/Card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Home() {
  // const [blogs, setBlogs] = useState<any[]>([]);
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchBlogs = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await fetch("http://localhost:5000/api/blogs");
  //       const data = await res.json();
  //       setBlogs(data);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBlogs();
  // }, []);

  const { isLoading, data: blogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/api/blogs')
      return res.data
    },
  })

  if (isLoading) return "loading...";

  return (
    <>
      <div className="container mx-auto my-8 px-4 sm:px-0 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold">Latest Blogs</h1>
        <p className="text-sm mt-10 max-w-[740px] mx-auto sm:text-base">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus
          sequi corrupti eveniet unde quod modi soluta aliquam praesentium
          fugiat vitae totam, repudiandae mollitia numquam distinctio eius,
          porro eaque exercitationem voluptas?
        </p>
      </div>
      <div className="w-full px-4 sm:px-0 sm:w-auto sm:container sm:mx-auto mb-10">
        <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {blogs?.map((blog:any) => (
            <Card key={blog._id} {...blog} />
          ))}
        </div>
      </div>
    </>
  );
}
