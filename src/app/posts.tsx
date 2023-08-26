'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PostType, getPosts } from "./page";

export default function Posts(){
    const queryClient = useQueryClient();
    const {data, isLoading} = useQuery({
        queryKey:['posts'],
        queryFn: getPosts,

    });
    const mutation = useMutation({
        mutationFn: async()=>{
            return 4;
        },
        onMutate: async (deletedPost: PostType)=>{
            await queryClient.cancelQueries(['posts']);
            const previousPosts = queryClient.getQueryData<PostType[]>(['posts']);
            //update data
            queryClient.setQueryData(['posts'],previousPosts?.filter((post)=>post.id !==deletedPost.id));
            return {previousPosts};
        },
        onError:(error,posts,context)=>{
            queryClient.setQueryData(['posts'],context?.previousPosts)
        },
        onSettled:()=>{
            queryClient.invalidateQueries(['posts'])
        },
        onSuccess:(data,posts,context)=>{},
    })
    if(isLoading)(<h1>Loading....</h1>)
    return(
        <div>
            <h1>Posts</h1>
            {
                data?.map((post,idx)=>(
                    <div key={idx} className="border-black, border-2 rounded-md">
                        <h1 className="text-xl font-bold">{post.title}</h1>
                        <p>{post.body}</p>
                    </div>
                ))
            }
        </div>
    )
}