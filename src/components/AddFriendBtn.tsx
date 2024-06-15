'use client'
import { FC, useState } from 'react'
import axios, { AxiosError } from 'axios'
import Button from './ui/Button'
import { addFriendValidator } from '@/lib/validations/add-friend'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import styles from './comp_style/addfriend_style.module.scss'

interface AddFriendBtnProps { }

type FormData = z.infer<typeof addFriendValidator>

const AddFriendBtn: FC<AddFriendBtnProps> = ({ }) => {
  const [showSuccessStatus, setShowSuccessStatus] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  })

  const addFriend = async (email: string) => {
    try {
      const validateEmail = addFriendValidator.parse({ email })
      await axios.post('/api/friends/add', {
        email: validateEmail,
      })
      setShowSuccessStatus(true)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('email', { message: error.message })
        return
      }
      if (error instanceof AxiosError) {
        setError('email', { message: error.response?.data })
        return
      }
      setError('email', { message: 'Something went wrong' })
    }
  }

  const onSubmit = (data: FormData) => {
    addFriend(data.email)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles['form-container']}>


      <div>
        <input
          {...register('email')}
          type='text'
          placeholder='your_friend@gmail.com'
          className={styles.input}
        />
      </div>
      <Button className={styles.button}>Add</Button>
      <p className={styles['error-message']}>{errors.email?.message}</p>
      {showSuccessStatus && (
        <p className={styles['success-message']}>Friend Request Sent!</p>
      )}
      
      
    </form>
  )
}

export default AddFriendBtn
