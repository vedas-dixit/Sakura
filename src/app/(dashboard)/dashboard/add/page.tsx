import AddFriendBtn from '@/components/AddFriendBtn'
import { FC } from 'react'
import styles from './style.module.scss'
const page: FC = ({ }) => {

  return (
    <main className={styles.main}>
      <p>add a</p>
      <h1 >Friend</h1>
      <AddFriendBtn />

    </main>
  )
}

export default page