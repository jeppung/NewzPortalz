import Link from 'next/link'
import React from 'react'

const NavAdmin = () => {
    return (
        <>
            <Link href="/admin/posts">Posts</Link>
            <Link href="/admin/subscriptions">Subscriptions</Link>
            <Link href="/admin/transactions">Transactions</Link>
        </>
    )
}

export default NavAdmin