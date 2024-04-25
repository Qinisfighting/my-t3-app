
// import type { NextPage } from "next";
// import Head from "next/head";
import { api } from "~/utils/api";

import { PostView } from "~/components/postview";
// import { generateSSGHelper } from "~/server/helpers/ssgHelper";
// import { LoadingPage } from "~/components/loading";


const ProfileFeed = (props: { userId: string}) => {
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


export default ProfileFeed;
