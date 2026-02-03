'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteUserButtonProps {
  userId: string
}

export default function DeleteUserButton({ userId }: DeleteUserButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/users')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete user')
        setIsDeleting(false)
        setShowConfirm(false)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('An error occurred. Please try again.')
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="mt-6 p-4 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded">
        <p className="text-sm text-gray-900 dark:text-gray-100 font-light mb-4">
          Are you sure you want to delete the user account?
        </p>
        <div className="flex space-x-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm font-light rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Yes'}
          </button>
          <button
            onClick={() => {
              setShowConfirm(false)
              setIsDeleting(false)
            }}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 text-sm font-light rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm font-light rounded"
    >
      Delete User
    </button>
  )
}
