'use client'

import { useState, useEffect } from 'react'
import { 
  User as UserIcon, 
  Trash2, 
  MoreVertical, 
  Mail, 
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'

interface User {
  id: string
  email: string
  name?: string | null
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить пользователей",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setUsers(users.filter(u => u.id !== selectedUser.id))
        toast({
          title: "Успешно",
          description: "Пользователь удален"
        })
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить пользователя",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пользователя",
        variant: "destructive"
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление пользователями</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader className="p-0 relative">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-gray-400" />
              </div>
              {user.role === 'ADMIN' && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                  Владелец
                </Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Dialog>
                    <DialogTrigger>
                      <DropdownMenuItem 
                        onClick={() => setSelectedUser(user)}
                      >
                        <UserIcon className="mr-2 h-4 w-4" />
                        Данные
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Данные пользователя</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                          <div>
                            <p className="font-medium">{user.name || 'Не указано'}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-6 w-6 text-gray-500" />
                          <div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-6 w-6 text-gray-500" />
                          <div>
                            <p className="font-medium">Роль</p>
                            <p className="text-sm text-gray-500">{user.role === 'ADMIN' ? 'Владелец' : 'Пользователь'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                          <div>
                            <p className="font-medium">Пароль</p>
                            <p className="text-sm text-gray-500">••••••••</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <DropdownMenuItem 
                    onClick={() => {
                      setSelectedUser(user)
                      setIsDeleteDialogOpen(true)
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить аккаунт
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{user.name || 'Не указано'}</CardTitle>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <Mail className="mr-1 h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="mr-1 h-4 w-4" />
                  <span>{user.role === 'ADMIN' ? 'Владелец' : 'Пользователь'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedUser && (
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Удалить аккаунт</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Вы действительно хотите удалить аккаунт "{selectedUser.name || selectedUser.email}"?</p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Отмена
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Удалить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}