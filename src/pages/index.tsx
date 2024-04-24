import Head from "next/head";
// import Link from "next/link";
import { SignInButton, UserButton, useUser} from "@clerk/nextjs";
import { api } from "~/utils/api"
/* import { type Post } from "@prisma/client"; */
/* import Image from "next/image"; */
import { useState } from "react";


export default function Home() {
  // const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const { data } = api.post.getAll.useQuery();
  const { user } = useUser();
  const [input, setInput] = useState("");

  console.log(user)

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#09090b] to-[#27272a]">
        <div className="w-full h-screen md:w-1/3 border-x-[1px] border-slate-600 py-10">
            { !user&& <SignInButton>  
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign in
            </button>
          </SignInButton>}
          { user &&  
              <div className="border-b-[1px] border-slate-600 flex gap-4">
              <UserButton appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: 70,
                    height: 70,
                    marginBottom: 20,
                    marginLeft: 20,
                  }
                }
              }} />
               <input
        placeholder="Type somgthing here!"
        className="grow bg-transparent outline-none text-white placeholder-slate-600"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
       /*  onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }} */
       /*  disabled={isPosting} */
      />
          </div>
          
          } 
          {/* {!user && 
            <SignIn path="/sign-in" routing="path" >
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Sign in
              </button>
            </SignIn>} */}
              <div className="m-6">
                {data?.map(({post, author}) => {
                  return (
                    <div key={post.id} className="text-white border-b-[1px] border-slate-600 py-4">              
                      {post.content} from  {author?.username}
                    </div>
                  );
                
                })}
               
              </div>
            </div>      
     </main>
    </>
  )
    }
