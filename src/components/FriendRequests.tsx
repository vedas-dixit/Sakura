'use client'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import styles from './comp_style/FriendRequests_style.module.scss'
import { FC, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'

interface IncomingFriendRequest {
    senderId: string
    senderEmail: string
}

interface FriendRequestsProps {
    incomingFriendRequests: IncomingFriendRequest[]
    sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({
    incomingFriendRequests, sessionId }
) => {
    const router = useRouter()
    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(incomingFriendRequests)
    
    //! SOCKET web req. update
    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
        console.log("sub to1", `user:${sessionId}:incoming_friend_requests`)

        const friendRequestHandler = ({ senderId, senderEmail }: IncomingFriendRequest) => {
            setFriendRequests((prev) => [...prev, { senderId, senderEmail }])
        }

        pusherClient.bind('incoming_friend_requests', friendRequestHandler)
        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
            pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
        }
    }, [sessionId])

    const acceptFriend = async (senderId: string) => {
        await axios.post('/api/friends/accept', { id: senderId })
        setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId))
        router.refresh()
    }

    const denyFriend = async (senderId: string) => {
        await axios.post('/api/friends/deny', { id: senderId })
        setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId))
        router.refresh()
    }

    return (
        <>
            {friendRequests.length === 0 ? (
                <p className="nothing-to-show">Nothing to show here...</p>
            ) : (
                friendRequests.map((reqs) => (
                    <div key={reqs.senderId} className={styles.friendreq}>
                        <h1>{reqs.senderEmail}</h1>
                        <g>
                        <button className="accept-button" onClick={() => acceptFriend(reqs.senderId)}>+</button>
                        <button className="deny-button" onClick={() => denyFriend(reqs.senderId)}>-</button>
                        </g>
                    </div>
                ))
            )}
        </>
    )
}

export default FriendRequests
