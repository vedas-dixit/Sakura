import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis('zrange', `chat:${chatId}:messages`, 0, -1)
    const dbMessages = results.map((message) => JSON.parse(message) as Message)
    // const reversedDbMessages = dbMessages.reverse()
    const reversedDbMessages = dbMessages
    const messages = messageArrayValidator.parse(reversedDbMessages)
    return messages
  } catch (error) {
    notFound()
  }
}

const page = async ({ params }: pageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound()

  const { user } = session


  const [userId1, userId2] = chatId.split('--');
  if (user.id !== userId1 && user.id !== userId2) { notFound() }

  const chatPartnerId = user.id == userId1 ? userId2 : userId1;

  const chatpartner = (await db.get(`user:${chatPartnerId}`)) as User

  const initialMessages = await getChatMessages(chatId);

  return <div>
    <div>
      <div>
        <div>
          <Image
            width={50}
            height={50}
            referrerPolicy="no-referrer"
            src={chatpartner.image}
            alt={`${chatpartner.name} profile`}
          />
        </div>
      </div>
      <div>
        <span>{chatpartner.name}</span>
        <h5>{chatpartner.email}</h5>
      </div>

    </div>
    <Messages SessionImg={session.user.image} chatPartner={chatpartner} initialMessages={initialMessages} sessionId={session.user.id}/>
    <ChatInput chatId={chatId} chatPartner={chatpartner} />
  </div>
};

export default page;
