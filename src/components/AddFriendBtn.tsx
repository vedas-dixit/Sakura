'use client'
import { FC, useState } from 'react'
import axios, { AxiosError } from 'axios'
import Button from './ui/Button'
import { addFriendValidator } from '@/lib/validations/add-friend'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
interface AddFriendBtnProps { }

type FormData = z.infer<typeof addFriendValidator>

const AddFriendBtn: FC<AddFriendBtnProps> = ({ }) => {
  const [showSucessStatus, setshowSucessStatus] = useState<boolean>(false);

  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  })

  const addFriend = async (email: string) => {
    try {
      const validateEmail = addFriendValidator.parse({ email })
      await axios.post('/api/friends/add', {
        email: validateEmail,

      })
      setshowSucessStatus(true);
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
    addFriend(data.email);
  }

  return <form onSubmit={handleSubmit(onSubmit)}>
    <label htmlFor='email'>
      Add Friend By Email
    </label>

    <div>
      <input {...register('email')} type='text' placeholder='you@example.com' />
    </div>
    <Button>Add</Button>
    <p>{errors.email?.message}</p>
    {showSucessStatus ? (
      <p>Friend Request Sent!</p>
    ) : null}
  </form>
}

export default AddFriendBtn