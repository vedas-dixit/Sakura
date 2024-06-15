"use client"

import React, { FC, useState } from 'react';
import styles from './styles.module.scss';
import Button from '@/components/ui/Button';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Pointer } from 'lucide-react';


interface LoginPageProps { }

const LoginPage: FC<LoginPageProps> = ({ }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function loginWithGoogle() {
        setIsLoading(true);
        try {
            await signIn('google')
        } catch (error) {
            toast.error('Something Went Wrong')
        } finally {
            setIsLoading(false);
        }
    }
    const url = 'next.svg'

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                <a >
                    <h3>Sign up or Sign in with</h3>
                    <div onClick={loginWithGoogle} style={{ cursor: 'pointer',userSelect: 'none' }} className={styles.googlelogo}>
                            <span className={styles.g}>G</span>
                            <span className={styles.o1}>o</span>
                            <span className={styles.o2}>o</span>
                            <span className={styles.gl}>g</span>
                            <span className={styles.l}>l</span>
                            <span className={styles.e}>e</span>
                        </div>
                </a>
                <h2 style={{ cursor:'' ,userSelect: 'none' }}>SAKURA</h2>




                {/* <div className={styles.loginForm}>
                    <Button
                        isloading={isLoading}>
                        {isLoading ? null : <h1>...</h1>}
                    </Button>

                </div> */}
            </div>
        </div>
    );
};

export default LoginPage;