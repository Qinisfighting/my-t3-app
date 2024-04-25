import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import Link from "next/link";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["post"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
    const { post, author } = props;
    return (
        <div key={post.id} className="text-white border-b-[1px] border-slate-600 py-4">              
                      {post.content} 
                      <p className="text-sm text-slate-500">{`${dayjs(post.createdAt).fromNow()}`} from 
                        <Link href={`/${author.username}`}>
                            <span className="italic hover:text-slate-400"> {author?.username}</span>
                        </Link>      
                      </p>
        </div> 
    );
  };