import Hydrate from "@/lib/HydrateClient";
import getQueryClient from "@/lib/getQueryClient";
import { dehydrate } from "@tanstack/query-core";
import Posts from "./posts";
export interface PostType{
  id: number
  title:string
  body: string
}
export const getPosts =async (): Promise<PostType[]> => {
  const resp = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts: PostType[] = await resp.json();
  return posts;
}
export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(['posts'], getPosts);
  const dehydratedState = dehydrate(queryClient);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="border-black">
        <Hydrate state={dehydratedState} >
          <Posts/>
        </Hydrate>
      </div>
    </main>
  )
}
