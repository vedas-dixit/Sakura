import Image from "next/image";
import styles from "./page.module.css";
import { db } from "@/lib/db";

export default async function Home() {


  return (
    <main className={styles.main}>
      Hello
    </main>
  );
}
