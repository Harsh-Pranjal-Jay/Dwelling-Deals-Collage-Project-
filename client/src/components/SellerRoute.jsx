import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const SellerRoute = () => {
    const { currentUser } = useSelector(state => state.user)

    return (
        currentUser && currentUser.role === 'seller' ? <Outlet /> : <Navigate to={'/'} />
    )
}

export default SellerRoute 