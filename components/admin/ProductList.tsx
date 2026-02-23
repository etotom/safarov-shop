'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Image as ImageIcon,
  DollarSign,
  Tag,
  Ruler
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  price: number
  currency: string
  categoryId: string
  material?: string | null
  featured: boolean
  createdAt: Date
  updatedAt: Date
  category?: {
    name: string
  }
  images?: Array<{
    id: string
    url: string
    alt?: string | null
  }>
  variants?: Array<{
    id: string
    name: string
    value: string
  }>
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      // Если приходит объект с products, извлекаем массив
      const productsData = data.products || data
      setProducts(Array.isArray(productsData) ? productsData : [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить товары",
        variant: "destructive"
      })
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    try {
      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== selectedProduct.id))
        toast({
          title: "Успешно",
          description: "Товар удален"
        })
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить товар",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
        variant: "destructive"
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
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
        <h1 className="text-2xl font-bold">Управление товарами</h1>
        <Dialog>
          <DialogTrigger>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Создать новый товар
            </Button>
          </DialogTrigger>
          <ProductForm categories={categories} onSuccess={fetchProducts} />
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="p-0 relative">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0].url} 
                    alt={product.images[0].alt || product.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                )}
              </div>
              {product.featured && (
                <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                  Рекомендуемый
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
                  <DropdownMenuItem 
                    onClick={() => {
                      setSelectedProduct(product)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Редактировать
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      setSelectedProduct(product)
                      setIsDeleteDialogOpen(true)
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-4 w-4" />
                  <span>{product.price} {product.currency}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="mr-1 h-4 w-4" />
                  <span>{product.category?.name || 'Без категории'}</span>
                </div>
                {product.material && (
                  <div className="flex items-center">
                    <Ruler className="mr-1 h-4 w-4" />
                    <span>{product.material}</span>
                  </div>
                )}
                {product.variants && product.variants.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.variants.map((variant) => (
                      <Badge key={variant.id} variant="secondary">
                        {variant.name}: {variant.value}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Product Dialog */}
      {isEditDialogOpen && selectedProduct && (
        <Dialog>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Редактировать товар</DialogTitle>
            </DialogHeader>
            <ProductForm 
              product={selectedProduct} 
              categories={categories} 
              onSuccess={fetchProducts} 
              onClose={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedProduct && (
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Удалить товар</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Вы действительно хотите удалить товар "{selectedProduct.name}"?</p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Отмена
              </Button>
              <Button variant="destructive" onClick={handleDeleteProduct}>
                Удалить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Product Form Component
function ProductForm({ 
  product, 
  categories, 
  onSuccess, 
  onClose 
}: { 
  product?: Product
  categories: Category[]
  onSuccess: () => void
  onClose?: () => void
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price.toString() || '',
    currency: product?.currency || 'USD',
    categoryId: product?.categoryId || '',
    material: product?.material || '',
    featured: product?.featured || false,
    images: [] as File[],
    variants: product?.variants || [{ name: '', value: '' }]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formDataObj = new FormData()
    formDataObj.append('name', formData.name)
    formDataObj.append('description', formData.description)
    formDataObj.append('price', formData.price)
    formDataObj.append('currency', formData.currency)
    formDataObj.append('categoryId', formData.categoryId)
    formDataObj.append('material', formData.material)
    formDataObj.append('featured', formData.featured.toString())
    
    formData.images.forEach((file, index) => {
      formDataObj.append('images', file)
    })

    try {
      const url = product 
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formDataObj
      })

      if (response.ok) {
        onSuccess()
        if (onClose) onClose()
        toast({
          title: "Успешно",
          description: product ? "Товар обновлен" : "Товар создан"
        })
      } else {
        toast({
          title: "Ошибка",
          description: product ? "Не удалось обновить товар" : "Не удалось создать товар",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении",
        variant: "destructive"
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Название товара</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
            required
            className="text-black dark:text-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Цена</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, price: e.target.value})}
            required
            className="text-black dark:text-black"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Валюта</Label>
          <Select 
            value={formData.currency} 
            onValueChange={(value: string) => setFormData({...formData, currency: value})}
          >
            <SelectTrigger className="text-black dark:text-black">
              <SelectValue placeholder="Выберите валюту" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">
                <div className="flex items-center space-x-2">
                  <span>USD</span>
                </div>
              </SelectItem>
              <SelectItem value="EUR">
                <div className="flex items-center space-x-2">
                  <span>EUR</span>
                </div>
              </SelectItem>
              <SelectItem value="RUB">
                <div className="flex items-center space-x-2">
                  <span>RUB</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Категория</Label>
          <Select 
            value={formData.categoryId} 
            onValueChange={(value: string) => setFormData({...formData, categoryId: value})}
          >
            <SelectTrigger className="text-black dark:text-black">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center space-x-2">
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="material">Состав</Label>
        <Input
          id="material"
          value={formData.material}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, material: e.target.value})}
          className="text-black dark:text-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
          rows={4}
          className="text-black dark:text-black"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.featured}
          onCheckedChange={(checked: boolean) => setFormData({...formData, featured: checked})}
        />
        <Label>Рекомендуемый товар</Label>
      </div>

      <div className="space-y-2">
        <Label>Изображения</Label>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              setFormData({...formData, images: Array.from(e.target.files)})
            }
          }}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button type="submit">
          {product ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </form>
  )
}