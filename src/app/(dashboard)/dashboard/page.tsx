import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { FC } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFriendsByUserId } from "@/helpers/get-friends-by-id";
import { fetchRedis } from "@/helpers/redis";
import { chatHerfConstructor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
interface pageProps { }

const page = async ({ }) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user.id);
  const friendwithLastmessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastmessageraw] = await fetchRedis('zrange', `chat:${chatHerfConstructor(session.user.id, friend.id)}:messages`, -1, -1) as string[]
      const lastmessage = JSON.parse(lastmessageraw) as Message
      console.log(lastmessage)
      return {
        ...friend, lastmessage
      }
    })
  )
  console.log("friendwithlastmessqage", friendwithLastmessage)
  return <div>
    {/* <pre>{JSON.stringify(session)}</pre> */}
    
    
    <h1>Recent Chat</h1>
    {friendwithLastmessage.length ===0 ? (
      <p>Nothing to show here :(</p>
    ) : (
      friendwithLastmessage.map((friend)=>(
        <div key={friend.id}>
          <div>
            <ChevronRight/>
          </div>
          <Link href={`/dashboard/chat/${chatHerfConstructor(session.user.id,friend.id)}`}>
            <div>
              <Image
              alt={`${friend.email} profile pic`}
              src={friend.image}
              width={40}
              height={40}
              />
            </div>
            <h4>{friend.name}</h4>
            <p>{friend.lastmessage.senderId ===session.user.id ? 'You: ' : ''}</p>
            {friend.lastmessage.text}
          </Link>

        </div>
      ))
    )}
  </div>
}

export default page