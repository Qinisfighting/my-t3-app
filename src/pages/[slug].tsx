
// import type { NextPage } from "next";
// import Head from "next/head";
import { api } from "~/utils/api";

import { PostView } from "~/components/postview";
import type { NextPage } from "next";
// import { generateSSGHelper } from "~/server/helpers/ssgHelper";
// import { LoadingPage } from "~/components/loading";


const ProfileFeed = (props: { userId: string }) => {
    const { data } = api.post.getPostsByUserId.useQuery({
        userId: props.userId,

    });


    return (
        <div className="flex flex-col">
            {data?.map(({post, author}) => {
                                    return (
                                        <PostView post={post} author={author} key={post.id} />
                                    );
                                })}
         </div>
    );
};

const ProfilePage: NextPage<{ username:string }> = ({}) => {
        const { data } = api.profile.getUserByUsername.useQuery({
            username: "username",
      
        });
        if (!data) return <div>404</div>;
        console.log(data);
        return (
            <>      
                    <div className="relative h-36 bg-slate-600">
                    
                    </div>
                    <div className="h-[64px]"></div>
                    <div className="p-4 text-2xl font-bold">{`${
                        data.username ?? data.externalUsername ?? "unknown"
                    }`}</div>
                    <div className="w-full border-b border-slate-400" />
                    <ProfileFeed userId={data.id} />
         
            </>
        );
    };
    

export default ProfilePage;
