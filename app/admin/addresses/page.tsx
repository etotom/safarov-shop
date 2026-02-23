import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function AdminAddressesPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Адреса пользователей</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Здесь вы можете просматривать адреса пользователей.
      </p>
    </div>
  )
}