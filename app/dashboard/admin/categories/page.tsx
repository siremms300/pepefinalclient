'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon,
  FolderIcon,
  PhotoIcon,
  ChevronRightIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'

interface Category {
  _id: string
  name: string
  description?: string
  images: string[]
  imagePublicId: string
  color: string
  parentId?: string | null
  parentCatName?: string
  status: 'Active' | 'Inactive'
  createdAt: string
  subcategories?: Category[]
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#FF6B9D',
    parentId: '',
    status: 'Active' as 'Active' | 'Inactive',
    image: null as File | null
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('color', formData.color)
      formDataToSend.append('status', formData.status)
      if (formData.parentId) {
        formDataToSend.append('parentId', formData.parentId)
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      const url = editingCategory 
        ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${editingCategory._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/categories`

      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      })

      const data = await response.json()
      
      if (data.success) {
        fetchCategories()
        setShowCreateModal(false)
        setEditingCategory(null)
        resetForm()
        alert(editingCategory ? 'Category updated!' : 'Category created!')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Failed to save category')
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        fetchCategories()
        alert('Category deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#FF6B9D',
      parentId: '',
      status: 'Active',
      image: null
    })
    setEditingCategory(null)
  }

  const startEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#FF6B9D',
      parentId: category.parentId || '',
      status: category.status,
      image: null
    })
    setShowCreateModal(true)
  }

  const getParentCategories = () => {
    return categories.filter(cat => !cat.parentId)
  }

  const getCategoryPath = (category: Category): string => {
    if (!category.parentCatName) return category.name
    return `${category.parentCatName} > ${category.name}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowCreateModal(true)
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(c => c.status === 'Active').length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <FolderIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Main Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(c => !c.parentId).length}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Squares2X2Icon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Subcategories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(c => c.parentId).length}
              </p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <ChevronRightIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pepe-primary">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="text-center py-12">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories
            .filter(category => 
              category.name.toLowerCase().includes(search.toLowerCase()) ||
              category.description?.toLowerCase().includes(search.toLowerCase())
            )
            .map((category) => (
              <div key={category._id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow">
                {/* Category Header */}
                <div 
                  className="h-2"
                  style={{ backgroundColor: category.color || '#FF6B9D' }}
                />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: category.color || '#FF6B9D' }}
                      >
                        <FolderIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{category.name}</h3>
                        {category.parentCatName && (
                          <p className="text-sm text-gray-500">
                            {getCategoryPath(category)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      category.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.status}
                    </span>
                  </div>

                  {/* Description */}
                  {category.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {category.description}
                    </p>
                  )}

                  {/* Image Preview */}
                  {category.images && category.images[0] && (
                    <div className="mb-4">
                      <div className="relative h-40 w-full rounded-lg overflow-hidden">
                        <img
                          src={category.images[0]}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-xs text-gray-500">Products</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {category.subcategories?.length || 0}
                      </p>
                      <p className="text-xs text-gray-500">Subcategories</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(category)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-1"
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center space-x-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                    required
                    placeholder="e.g., Breakfast, Lunch, Drinks"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                    placeholder="Brief description of this category"
                  />
                </div>

                {/* Parent Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Category
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                  >
                    <option value="">No parent (Main Category)</option>
                    {getParentCategories()
                      .filter(cat => !editingCategory || cat._id !== editingCategory._id)
                      .map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="w-12 h-12 cursor-pointer rounded-lg border"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                      placeholder="#FF6B9D"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">
                      {formData.image 
                        ? formData.image.name 
                        : 'Drag and drop an image, or click to browse'}
                    </p>
                    <label className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200">
                      Browse Files
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && setFormData({
                          ...formData,
                          image: e.target.files[0]
                        })}
                      />
                    </label>
                    {editingCategory?.images?.[0] && !formData.image && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                        <img
                          src={editingCategory.images[0]}
                          alt="Current"
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      resetForm()
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
                  >
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}