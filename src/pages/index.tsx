import Navbar from "@/components/navbar";


export default function Home() {
  return (
    <>
      <Navbar />
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24`}
      >
        <h1>This is user page</h1>
      </main>
    </>
  )
}
