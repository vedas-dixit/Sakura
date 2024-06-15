import FriendRequests from '@/components/FriendRequests'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'
import styles from './style.module.scss'

const page = async () => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()
    
    const incomingSenderIds = (await fetchRedis('smembers',
    `user:${session.user.id}:incomming_friend_requests`
    )) as string[]

    const incommingfriendrequests = await Promise.all(
        incomingSenderIds.map(async(senderId)=>{
            const sender = await fetchRedis('get',`user:${senderId}`) as string
            const senderParsed = JSON.parse(sender) as User
            return {
                senderId,
                senderEmail: senderParsed.email,
            }
        })
    )

    console.log("incommingfriendrequests",incommingfriendrequests)

    
    return <main className={styles.main}>
        <h1>Friend Requests</h1>
        <div>
            <FriendRequests incomingFriendRequests={incommingfriendrequests} sessionId={session.user.id}/>
        </div>
    </main>
}

export default page