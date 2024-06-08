'use client'
import { pusherClient } from '@/lib/pusher'
import { chatHerfConstructor, toPusherKey } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import UnseenChatToast from './UnseenChatToast'

interface SidebarChatListProps {
  friends: User[]
  sessionId: string
}

interface extendedMessage extends Message{
  senderImg: string
  senderName: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ sessionId, friends }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
  const [activeChat,setactiveChat] = useState<User[]>(friends)
  const newFriendHandler = (newFriend:User) => {
    setactiveChat((prev)=>[...prev,newFriend])
  }
  
  const chatHandler = (message: extendedMessage) => {
    const shouldNotify = pathname !== `/dashboard/chat/${chatHerfConstructor(sessionId, message.senderId)}`

    if (!shouldNotify) return

    //! should notify:
    toast.custom((t) => (
      <UnseenChatToast
        t={t}
        sessionId={sessionId}
        senderId={message.senderId}
        senderImg={message.senderImg}
        senderMessage={message.text}
        senderName={message.senderName}
      />
    ))

    setUnseenMessages((prev) => [...prev, message])
  }

  useEffect(() => {
    const chatSubscription = toPusherKey(`user:${sessionId}:chats`)
    const friendSubscription = toPusherKey(`user:${sessionId}:friends`)

    pusherClient.subscribe(chatSubscription)
    pusherClient.subscribe(friendSubscription)

    pusherClient.bind('new_message', chatHandler)
    pusherClient.bind('new_friend', newFriendHandler)

    return () => {
      pusherClient.unsubscribe(chatSubscription)
      pusherClient.unsubscribe(friendSubscription)

      pusherClient.unbind('new_message', chatHandler)
      pusherClient.unbind('new_friend', newFriendHandler)
    }
  }, [sessionId, pathname]) // Add sessionId and pathname as dependencies

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId))
      })
    }
  }, [pathname])

  return (
    <ul role='list'>
      {activeChat.sort().map((friend) => {
        const unseenMessageCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id
        }).length
        return (
          <li key={friend.id}>
            <a href={`/dashboard/chat/${chatHerfConstructor(sessionId, friend.id)}`}>
              {friend.name}
              {unseenMessageCount > 0 ? (<div>{unseenMessageCount}</div>) : null}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default SidebarChatList