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
import styles from './style.module.scss'
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
    {friendwithLastmessage.length === 0 ? (

      //! Add a Auto quote API;

      <p>Quote</p>
    ) : (
      friendwithLastmessage.map((friend) => (
        <div className={styles.main} key={friend.id}>
          <Link className={styles.bars} href={`/dashboard/chat/${chatHerfConstructor(session.user.id, friend.id)}`}>
            <div className={styles.imgs}>
              <Image
                alt={`${friend.email} profile pic`}
                src={friend.image}
                width={60}
                height={60}
              />
              <h4>{friend.name}</h4>
            </div>


            <div className={styles.chat}>
              <p>
                {friend.lastmessage.senderId === session.user.id ? 'You: ' : ''}
              </p>
              {friend.lastmessage.text.length > 40 ?
                `${friend.lastmessage.text.substring(0, 40)}...` :
                friend.lastmessage.text
              }
            </div>

          </Link>


        </div>
      ))
    )}
  </div>
}

export default page