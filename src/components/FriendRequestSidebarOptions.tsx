'use client'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { User } from 'lucide-react'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import styles from './comp_style/FriendRequestSidebarOptions_style.module.scss'
interface FriendRequestSidebarOptionsProps {
    sessionId: string,
    initialunseenrequestcount: number
}



const FriendRequestSidebarOptions: FC<FriendRequestSidebarOptionsProps> = ({
    sessionId,
    initialunseenrequestcount
}) => {
    const [unseenRequestCount, setunseenRequestCount] = useState<number>(
        initialunseenrequestcount
    )


    useEffect(() => {
        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:incomming_friend_requests`)
        )
        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:friends`)
        )

        const friendRequestHandler = () => {
            setunseenRequestCount((prev) => prev + 1)
        }
        const addedfriendhandler = () => {
            setunseenRequestCount((prev) => prev - 1)
        }
        pusherClient.bind('incomming_friend_requests', friendRequestHandler)
        pusherClient.bind('new_friend', addedfriendhandler)
        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`user:${sessionId}:incomming_friend_requests`)
            )
            pusherClient.unsubscribe(
                toPusherKey(`user:${sessionId}:friends`)
            )
            pusherClient.unbind('new_friend', addedfriendhandler)
            pusherClient.unbind(
                'incomming_friend_requests', friendRequestHandler
            )
        }
    }, [sessionId])



    return <Link href="/dashboard/requests">
        <div>
            <User></User>
        </div>
        <g className={styles.main}>
            <p>Friend Requests</p>
            {unseenRequestCount > 0 ? (
                <div className={styles.count}>
                    {unseenRequestCount}
                </div>
            ) : null}
        </g>
    </Link>
}

export default FriendRequestSidebarOptions