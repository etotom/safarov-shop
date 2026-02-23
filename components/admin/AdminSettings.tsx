'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  MapPin, 
  Shield, 
  Save, 
  Edit3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

interface Admin {
  id: string
  email: string
  name?: string | null
  role: 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

export default function AdminSettings() {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  })

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      const adminData = data.find((user: Admin) => user.role === 'ADMIN')
      setAdmin(adminData)
      setFormData({
        name: adminData?.name || '',
        email: adminData?.email || '',
        address: 'Не указан' // В реальной системе адреса хранятся отдельно
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные администратора",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/users/${admin?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      })

      if (response.ok) {
        setAdmin({
          ...admin!,
          name: formData.name,
          email: formData.email,
          updatedAt: new Date()
        })
        setIsEditing(false)
        toast({
          title: "Успешно",
          description: "Данные администратора обновлены"
        })
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить данные администратора",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating admin data:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить данные администратора",
        variant: "destructive"
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      name: admin?.name || '',
      email: admin?.email || '',
      address: 'Не указан'
    })
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Настройки администратора</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Основная информация */}
        <Card>
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <CardTitle className="text-lg">Основная информация</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Данные владельца магазина</p>
                </div>
              </div>
              {!isEditing && (
                <Button onClick={handleEdit}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Редактировать
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <Label className="text-sm text-gray-500">Имя</Label>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{admin?.name || 'Не указано'}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <Label className="text-sm text-gray-500">Адрес</Label>
                  {isEditing ? (
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{formData.address}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <Label className="text-sm text-gray-500">Роль</Label>
                  <Badge className="mt-1 bg-red-500 text-white">
                    Владелец
                  </Badge>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-2 mt-6">
                <Button onClick={handleCancel}>
                  Отмена
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Контактная информация */}
        <Card>
          <CardHeader className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <MapPin className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <CardTitle className="text-lg">Контактная информация</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">Контактные данные владельца</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <Label className="text-sm text-gray-500">Email</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{admin?.email}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <Label className="text-sm text-gray-500">Пароль</Label>
                  <p className="mt-1 font-medium text-gray-600 dark:text-gray-300">••••••••</p>
                  <p className="text-xs text-gray-500 mt-1">Для изменения пароля обратитесь к системному администратору</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}