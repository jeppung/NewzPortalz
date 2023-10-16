import Link from 'next/link'
import React from 'react'

const NavUser = () => {
    return (
        <>
            <Link href="/#posts">Posts</Link>
            <Link href="/subscription">Subscription</Link>
            <Link href="/posts">Profile</Link>
        </>
    )
}

export default NavUser