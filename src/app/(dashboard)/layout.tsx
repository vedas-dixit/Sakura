import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOptions'
import { Icon, Icons } from '@/components/Icons'
import SignoutButton from '@/components/SignoutButton'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'

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

    const unseenrequestcount = (await 
        fetchRedis(
            'smembers', 
            `user:${session.user.id}:incomming_friend_requests`
        ) as User[]
    ).length

    return <div>
        <div>
            <Link href='/dashboard'>
                <Icons.Logo className='' />
            </Link>
            <div>Your Chats</div>
            <nav>
                <ul>
                    <li>
                    //Chat That User HAs
                    </li>
                    <li>
                        <div>
                            Overview
                        </div>
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
                        </ul>
                    </li>

                    <li>
                        <FriendRequestSidebarOptions sessionId={session.user.id} initialunseenrequestcount={unseenrequestcount} />
                    </li>

                    <li>
                        <div>
                            <div className='userimage'>
                                <Image
                                    width={100}
                                    height={100}

                                    referrerPolicy='no-referrer'
                                    src={session.user.image || ''}
                                    alt='profile pic'
                                />
                            </div>
                            <span>Your Profile</span>
                            <div>
                                <span>{session.user.name}</span>
                                <span>
                                    {session.user.email}
                                </span>
                            </div>
                        </div>
                        <SignoutButton></SignoutButton>
                    </li>
                </ul>
            </nav>
        </div>
        {children}
    </div>
}

export default Layout