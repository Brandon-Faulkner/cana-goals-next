"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthProvider'

export function withPublicRoute(Component) {
  return function WithPublicRoute(props) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && user) {
        router.replace('/main')
      }
    }, [user, loading, router])

    if (loading) {
      return (
        <div className="flex flex-col flex-grow h-full bg-white-light dark:bg-black-dark items-center justify-center">
          <div className="animate-spin inline-block size-12 border-3 border-current border-t-transparent text-green rounded-full">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )
    }

    if (!user) {
      return <Component {...props} />
    }

    return null
  }
}

export function withProtectedRoute(Component) {
  return function WithProtectedRoute(props) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !user) {
        router.replace('/login')
      }
    }, [user, loading, router])

    if (loading) {
      return (
        <div className="flex flex-col flex-grow h-full bg-white-light dark:bg-black-dark items-center justify-center">
          <div className="animate-spin inline-block size-12 border-3 border-current border-t-transparent text-green rounded-full">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )
    }

    if (user) {
      return <Component {...props} />
    }

    return null
  }
}