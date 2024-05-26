'use client'
import { Message } from '@/lib/validations/message'
import { FC, useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import Image from 'next/image'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'

interface MessagesProps {
    initialMessages: Message[]
    sessionId: string
    chatId: string
    SessionImg: string | null | undefined
    chatPartner:User
}

const Messages: FC<MessagesProps> = ({ SessionImg, chatPartner, initialMessages, sessionId, chatId }) => {
    const [message, SetMessage] = useState<Message[]>(initialMessages)
    const scrollDownref = useRef<HTMLDivElement | null>(null)

    const formatTimeStamp = (timestamp: number) => {
        return format(new Date(timestamp), 'HH:mm')
    }


    useEffect(()=>{
        pusherClient.subscribe(toPusherKey(`chat:${chatId}`))
        const messageHandler =(message: Message)=>{
            SetMessage((prev)=> [...prev,message])
        }
       

        pusherClient.bind('incomming_message',messageHandler)
        return ()=>{
            pusherClient.unsubscribe(
                toPusherKey(`chat:${chatId}`)
            )
            pusherClient.unbind(
                'incomming_message',messageHandler
            )
        }
    },[])
    





    return (
        <div id='messages'>
            <div ref={scrollDownref} />
            {message.map((msg, idx) => {
                const iscurrentUser = msg.senderId === sessionId
                const hasNextMessageFromSameUser = message[idx - 1]?.senderId === message[idx].senderId

                return (
                    <div key={`${msg.id}-${msg.timestamp}`}>
                        <div>
                            <span>
                                {iscurrentUser && (
                                    <div style={{ backgroundColor: "yellow" }}>
                                        {msg.text}{' '}
                                        <span>{formatTimeStamp(msg.timestamp)}</span>
                                    </div>
                                )}
                                {!iscurrentUser && (
                                    <div style={{ backgroundColor: "wheat" }}>
                                        {msg.text}{' '}
                                        <span>{formatTimeStamp(msg.timestamp)}</span>
                                    </div>
                                )}
                            </span>
                        </div>
                        <div>
                            <Image width={20} height={20} alt='user' src={
                                iscurrentUser?(SessionImg as string): chatPartner.image
                            }
                            referrerPolicy='no-referrer'
                            ></Image>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Messages
