import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOptions'
import { Icon, Icons } from '@/components/Icons'
import SidebarChatList from '@/components/SidebarChatList'
import SignoutButton from '@/components/SignoutButton'
import { getFriendsByUserId } from '@/helpers/get-friends-by-id'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'
import styles from './styles.module.scss'
interface layoutProps {
    children: ReactNode
}

interface SidebarOptions {
    id: number,
    name: string,
    herf: string,
    Icon: Icon
}

const sidebarOptions: SidebarOptions[] = [
    {
        id: 1,
        name: 'Add friend',
        herf: '/dashboard/add',
        Icon: 'UserPlus',
    }
]

const Layout = async ({ children }: layoutProps) => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()
    const friends = await getFriendsByUserId(session.user.id)
    const unseenrequestcount = (await
        fetchRedis(
            'smembers',
            `user:${session.user.id}:incomming_friend_requests`
        ) as User[]
    ).length

    return (
        <div className={styles.main}>
            <div className={styles.leftchild}>
                <Link href='/dashboard'>
                    <Icons.Logo className='' />
                </Link>

                <nav>

                    <ul>
                        <div className={styles.chatlist}>
                            {friends.length > 0 ? (

                                <h1>Your Chats</h1>

                            ) : null}
                            <li className={styles.chats}>
                                <SidebarChatList sessionId={session.user.id} friends={friends} />
                            </li>
                        </div>
                        <g>
                        <li className={styles.overview}>
                            
                            <ul>
                                {sidebarOptions.map((option) => {
                                    const Icon = Icons[option.Icon]
                                    return (
                                        <li key={option.id}>
                                            <Link href={option.herf}>
                                                <span>
                                                    <Icon></Icon>
                                                </span>
                                                <span>
                                                    {option.name}
                                                </span>
                                            </Link>
                                        </li>
                                    )
                                })}
                                <li>
                                    <FriendRequestSidebarOptions sessionId={session.user.id} initialunseenrequestcount={unseenrequestcount} />
                                </li>
                            </ul>
                        </li>



                        <li className={styles.profilemain}>
                            <div className={styles.profilesec}>
                                 
                                <div className={styles.userimg}>
                                    <Image
                                        width={60}
                                        height={60}

                                        referrerPolicy='no-referrer'
                                        src={session.user.image || ''}
                                        alt='profile pic'
                                    />
                                </div>
                                
                                <div>
                                    <span>{session.user.name}</span>
                                    <span>
                                        {session.user.email}
                                    </span>
                                </div>
                                <SignoutButton></SignoutButton>
                            </div>
                            
                        </li>

                        </g>
                    </ul>
                </nav>
            </div>
            <div className={styles.rightchild}>
                {children}
            </div>

        </div>)
}

export default Layout