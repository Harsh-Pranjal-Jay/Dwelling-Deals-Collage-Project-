import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function AdminRoute() {
    const { currentUser } = useSelector((state) => state.user.email === "dwellingdeals777@gmail.com")

    return currentUser ? <Outlet /> : <Navigate to="/" />
}
