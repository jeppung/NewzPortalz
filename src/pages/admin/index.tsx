import Navbar from '@/components/navbar'
import Head from 'next/head'
import React from 'react'

const Admin = () => {
    return (
        <>
            <Head>
                <title>Newz Portalz</title>
            </Head>
            <Navbar />
            <main className='max-w-7xl mx-auto'>
                <h1>This is an admin page</h1>
            </main>
        </>
    )
}

export default Admin
