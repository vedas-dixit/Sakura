'use client'
import { chatHerfConstructor } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface SidebarChatListProps {
  friends: User[]
  sessionId: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ sessionId,friends }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [unseenMessages, setunseenMessages] = useState<Message[]>([])

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setunseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId))
      })
    }
  }, [pathname])

  return (
    <ul role='list'>
      {
        friends.sort().map((friend) => {
          const unseenmessagecount = unseenMessages.filter((unseenmsg) => {
            return unseenmsg.senderId === friend.id
          }).length
          return (
            <li key={friend.id}>
              <a href={`/dashboard/chat/${chatHerfConstructor(sessionId,friend.id)}`}>
                {friend.name}
                {unseenmessagecount > 0 ? (<div>{unseenmessagecount}</div>) : null}
                </a>
            </li>
          )
        })
      }
    </ul>
  )
}

export default SidebarChatList