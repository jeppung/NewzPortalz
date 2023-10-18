import Link from 'next/link'
import React from 'react'

const NavUser = () => {
    return (
        <>
            <Link href="/#posts">Posts</Link>
            <Link href="/subscription">Subscription</Link>
            <Link href="/profile">Profile</Link>
        </>
    )
}

export default NavUser