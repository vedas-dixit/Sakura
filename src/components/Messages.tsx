'use client'
import { Message } from '@/lib/validations/message'
import { FC, useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import Image from 'next/image'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import styles from './comp_style/Messages_style.module.scss'

interface MessagesProps {
    initialMessages: Message[]
    sessionId: string
    chatId: string
    SessionImg: string | null | undefined
    chatPartner: User
}

const Messages: FC<MessagesProps> = ({ SessionImg, chatPartner, initialMessages, sessionId, chatId }) => {
    const [message, SetMessage] = useState<Message[]>(initialMessages)
    const scrollDownref = useRef<HTMLDivElement | null>(null)

    const formatTimeStamp = (timestamp: number) => {
        return format(new Date(timestamp), 'HH:mm')
    }

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`chat:${chatId}`))
        const messageHandler = (message: Message) => {
            SetMessage((prev) => [...prev, message])
        }

        pusherClient.bind('incomming_message', messageHandler)
        return () => {
            pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`))
            pusherClient.unbind('incomming_message', messageHandler)
        }
    }, [])

    useEffect(() => {
        scrollDownref.current?.scrollIntoView({ behavior: 'smooth' })
    }, [message])

    return (
        <div className={styles.main}>
            {message.map((msg, idx) => {
                const isCurrentUser = msg.senderId === sessionId

                return (
                    <div
                        key={`${msg.id}-${msg.timestamp}`}
                        className={`${styles.message} ${isCurrentUser ? styles.sent : styles.received}`}
                    >
                        <div className={styles.text}>
                            {msg.text}
                            <div className={styles.timestamp}>{formatTimeStamp(msg.timestamp)}</div>
                        </div>
                    </div>
                )
            })}
            <div ref={scrollDownref} />
        </div>
    )
}

export default Messages
