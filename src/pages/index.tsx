import Head from "next/head";
// import Link from "next/link";
import { SignInButton, UserButton, useUser} from "@clerk/nextjs";
import { api } from "~/utils/api"
import { type Post } from "@prisma/client";

export default function Home() {
  // const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const { data }: { data?: Post[] } = api.post.getAll.useQuery();
  const { user } = useUser();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      { !user&& <SignInButton>  
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Sign in
        </button>
      </SignInButton>}
      { user && <UserButton />}
      {/* {!user && 
        <SignIn path="/sign-in" routing="path" >
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign in
          </button>
        </SignIn>} */}
        <div>
          {data?.map((post) => {
            return (
              <div key={post.id} className="text-white">
                {post.content} from {post.authorId}
              </div>
            );
          
          })}
        </div>
     </main>
    </>
      )
    }
