"use client"
import React, { FC, useState, useEffect, useLayoutEffect } from 'react';
import styles from './styles.module.scss';
import Button from '@/components/ui/Button';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Pointer } from 'lucide-react';
import gsap from 'gsap';
import { motion } from 'framer-motion'
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import Framermagnetic from '../../../components/framermagnetic'
import SplitType from 'split-type';
interface LoginPageProps { }

const LoginPage: FC<LoginPageProps> = ({ }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    //! GSAP ANIM:

    useEffect(() => {
        const ourText = new SplitType('#text_1', { types: 'chars' })
        const chars = ourText.chars

        chars!.forEach(char => {
            char.addEventListener('mouseenter', () => {
                gsap.to(char, {

                    color: "white",
                    opacity: 1
                });
            });

            char.addEventListener('mouseleave', () => {
                gsap.to(char, { color: "black", opacity: 0.7 });
            });
        });


        gsap.fromTo(chars, {
            opacity: 0,
            y: -250
        }, {
            y: 0,
            opacity: 1,
            stagger: 0.13,
            duration: 4,
            ease: 'power4.out',

        })
    }, [])

    useLayoutEffect(() => {

        const tl = gsap.timeline({ defaults: { ease: 'power1.out' } });

        const ourText = new SplitType('#textss', { types: 'words' });
        const t1 = ourText.words;

        const ourText2 = new SplitType('#textss2', { types: 'words' });
        const t2 = ourText2.words;
        tl.from(t1, {
            opacity: 0.3,
            duration: 1,
            ease: 'power1.out',
            stagger: 0.2,
            onComplete: () => {
                setTimeout(() => { gsap.to(t1, { opacity: 0 }) }, 1000)
            }
        }).add(() => { }, "+=1").fromTo(t2, {
            opacity: 0
        }, {
            opacity: 1,
            duration: 0.7,
            ease: 'power1.out',
            stagger: 0.1,

        })

        gsap.to('#dott', {
            opacity: 0,
            duration: 1,
            repeat: -1,
            yoyo: true

        });



    }, [])


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
                    <Framermagnetic>
                        <div onClick={loginWithGoogle} style={{ cursor: 'pointer', userSelect: 'none', width: '100%' }} className={styles.googlelogo}>

                            <span className={styles.g}>G</span>
                            <span className={styles.o1}>o</span>
                            <span className={styles.o2}>o</span>
                            <span className={styles.gl}>g</span>
                            <span className={styles.l}>l</span>
                            <span className={styles.e}>e</span>
                        </div>
                    </Framermagnetic>
                </a>
                <h2 id='text_1' style={{ cursor: '', userSelect: 'none' }}>SAKURA</h2>

                <p className={styles.p11} id='textss' style={{ color: "white" }}>
                    Welcome to Sakura
                </p>

                <motion.p
                    style={{ opacity: 0 ,display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}
                    animate={{ opacity: 1  }}
                    transition={{ duration: 2, delay: 2 }}


                    className={styles.p22} id='textss2'>
                    <g>
                        Connect Freely, Message Securely<br />

                    </g>
                    <span id='dott' style={{ color: 'wheat' }}>❋</span>
                </motion.p>


            </div>
        </div>
    );
};

export default LoginPage;