import Image from 'next/image'
import { Inter } from 'next/font/google'


export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <h1>This is root page</h1>
    </main>
  )
}
