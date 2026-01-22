'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  PhotoIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface Banner {
  _id: string
  title: string
  description?: string
  imageUrl: string
  imagePublicId: string
  link?: string
  linkText?: string
  position: 'home_top' | 'home_middle' | 'sidebar' | 'popup'
  status: 'active' | 'inactive' | 'scheduled'
  order: number
  startDate?: string
  endDate?: string
  createdAt: string
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    linkText: 'Learn More',
    position: 'home_top' as Banner['position'],
    status: 'active' as Banner['status'],
    order: 1,
    startDate: '',
    endDate: '',
    image: null as File | null
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      // In a real app, fetch from your API
      const mockBanners: Banner[] = [
        {
          _id: '1',
          title: 'Summer Special Offer',
          description: 'Get 20% off on all summer drinks',
          imageUrl: '/banners/summer-offer.jpg',
          imagePublicId: 'summer-offer',
          link: '/promo/summer',
          linkText: 'Order Now',
          position: 'home_top',
          status: 'active',
          order: 1,
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          createdAt: '2024-05-15T10:30:00Z'
        },
        {
          _id: '2',
          title: 'Free Delivery',
          description: 'Free delivery on orders above ₦5,000',
          imageUrl: '/banners/free-delivery.jpg',
          imagePublicId: 'free-delivery',
          link: '/products',
          linkText: 'Shop Now',
          position: 'home_middle',
          status: 'active',
          order: 2,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          createdAt: '2024-01-01T09:00:00Z'
        }
      ]
      
      setBanners(mockBanners)
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // In a real app, make API call here
      console.log('Form data:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingBanner) {
        alert('Banner updated successfully!')
      } else {
        alert('Banner created successfully!')
      }
      
      fetchBanners()
      setShowCreateModal(false)
      setEditingBanner(null)
      resetForm()
    } catch (error) {
      console.error('Error saving banner:', error)
      alert('Failed to save banner')
    }
  }

  const handleDelete = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
    
    try {
      // In a real app, make API call here
      await new Promise(resolve => setTimeout(resolve, 500))
      alert('Banner deleted successfully')
      fetchBanners()
    } catch (error) {
      console.error('Error deleting banner:', error)
      alert('Failed to delete banner')
    }
  }

  const handleStatusToggle = async (bannerId: string, currentStatus: Banner['status']) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      // In a real app, make API call here
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setBanners(prev => prev.map(banner => 
        banner._id === bannerId 
          ? { ...banner, status: newStatus }
          : banner
      ))
      
      alert(`Banner ${newStatus === 'active' ? 'activated' : 'deactivated'}!`)
    } catch (error) {
      console.error('Error updating banner status:', error)
    }
  }

  const handleReorder = async (bannerId: string, direction: 'up' | 'down') => {
    try {
      // In a real app, make API call here
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setBanners(prev => {
        const index = prev.findIndex(b => b._id === bannerId)
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === prev.length - 1)) {
          return prev
        }
        
        const newBanners = [...prev]
        const swapIndex = direction === 'up' ? index - 1 : index + 1
        ;[newBanners[index], newBanners[swapIndex]] = [newBanners[swapIndex], newBanners[index]]
        
        return newBanners
      })
    } catch (error) {
      console.error('Error reordering banner:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      link: '',
      linkText: 'Learn More',
      position: 'home_top',
      status: 'active',
      order: banners.length + 1,
      startDate: '',
      endDate: '',
      image: null
    })
    setEditingBanner(null)
  }

  const startEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      description: banner.description || '',
      link: banner.link || '',
      linkText: banner.linkText || 'Learn More',
      position: banner.position,
      status: banner.status,
      order: banner.order,
      startDate: banner.startDate || '',
      endDate: banner.endDate || '',
      image: null
    })
    setShowCreateModal(true)
  }

  const getPositionLabel = (position: Banner['position']) => {
    const labels = {
      home_top: 'Homepage Top',
      home_middle: 'Homepage Middle',
      sidebar: 'Sidebar',
      popup: 'Popup'
    }
    return labels[position]
  }

  const getStatusColor = (status: Banner['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banners & Promotions</h1>
          <p className="text-gray-600">Manage promotional banners across your site</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowCreateModal(true)
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Banner</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Banners</p>
              <p className="text-2xl font-bold text-gray-900">{banners.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <PhotoIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Banners</p>
              <p className="text-2xl font-bold text-gray-900">
                {banners.filter(b => b.status === 'active').length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <EyeIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {banners.filter(b => b.status === 'scheduled').length}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Positions Used</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(banners.map(b => b.position)).size}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <EyeSlashIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Banners List */}
      {loading ? (
        <div className="text-center py-12">Loading banners...</div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No banners yet</h3>
          <p className="text-gray-600 mb-6">Create your first promotional banner to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
          >
            Create First Banner
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banner Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map((banner) => (
                  <tr key={banner._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ 
                            backgroundImage: `url(${banner.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            {getPositionLabel(banner.position)}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{banner.title}</h3>
                        {banner.description && (
                          <p className="text-sm text-gray-600 mt-1">{banner.description}</p>
                        )}
                        {banner.link && (
                          <p className="text-sm text-gray-500 mt-1">
                            Link: <span className="text-pepe-primary">{banner.linkText}</span> → {banner.link}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Order: #{banner.order} • Created: {new Date(banner.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {getPositionLabel(banner.position)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(banner.status)}`}>
                        {banner.status.charAt(0).toUpperCase() + banner.status.slice(1)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {banner.startDate ? (
                        <div>
                          <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {new Date(banner.startDate).toLocaleDateString()}
                          </div>
                          {banner.endDate && (
                            <div className="text-xs mt-1">
                              to {new Date(banner.endDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        'No schedule'
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* Reorder buttons */}
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleReorder(banner._id, 'up')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Move up"
                          >
                            <ArrowUpIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReorder(banner._id, 'down')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Move down"
                          >
                            <ArrowDownIcon className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Status toggle */}
                        <button
                          onClick={() => handleStatusToggle(banner._id, banner.status)}
                          className={`px-2 py-1 rounded text-xs ${
                            banner.status === 'active'
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                        >
                          {banner.status === 'active' ? (
                            <>
                              <EyeSlashIcon className="w-3 h-3 inline mr-1" />
                              Hide
                            </>
                          ) : (
                            <>
                              <EyeIcon className="w-3 h-3 inline mr-1" />
                              Show
                            </>
                          )}
                        </button>
                        
                        {/* Edit */}
                        <button
                          onClick={() => startEdit(banner)}
                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100"
                        >
                          <PencilIcon className="w-3 h-3 inline mr-1" />
                          Edit
                        </button>
                        
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100"
                        >
                          <TrashIcon className="w-3 h-3 inline mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {banners.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners
              .filter(b => b.status === 'active')
              .slice(0, 2)
              .map((banner) => (
                <div key={banner._id} className="relative rounded-xl overflow-hidden">
                  <div 
                    className="h-48 bg-gradient-to-r from-pepe-primary to-pink-500 flex flex-col items-center justify-center p-6"
                    style={{ 
                      backgroundImage: `url(${banner.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    <div className="relative z-10 text-center text-white">
                      <h4 className="text-xl font-bold mb-2">{banner.title}</h4>
                      {banner.description && (
                        <p className="mb-4 opacity-90">{banner.description}</p>
                      )}
                      {banner.linkText && (
                        <button className="px-6 py-2 bg-white text-pepe-primary rounded-lg font-medium hover:bg-gray-100">
                          {banner.linkText}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
                    {getPositionLabel(banner.position)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingBanner ? 'Edit Banner' : 'Create New Banner'}
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
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                    required
                    placeholder="e.g., Summer Sale, Free Delivery"
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
                    rows={2}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                    placeholder="Brief description or promotional text"
                  />
                </div>

                {/* Link */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link URL
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({...formData, link: e.target.value})}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                      placeholder="https://example.com/promo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.linkText}
                      onChange={(e) => setFormData({...formData, linkText: e.target.value})}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                      placeholder="e.g., Shop Now, Learn More"
                    />
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value as Banner['position']})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                    required
                  >
                    <option value="home_top">Homepage Top (Main Banner)</option>
                    <option value="home_middle">Homepage Middle</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="popup">Popup</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Where this banner will be displayed
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['active', 'inactive', 'scheduled'] as const).map((status) => (
                      <label
                        key={status}
                        className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                          formData.status === status
                            ? 'border-pepe-primary bg-pepe-primary bg-opacity-5'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          value={status}
                          checked={formData.status === status}
                          onChange={(e) => setFormData({...formData, status: e.target.value as Banner['status']})}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-2">
                          {status === 'active' && <EyeIcon className="w-5 h-5 text-green-600" />}
                          {status === 'inactive' && <EyeSlashIcon className="w-5 h-5 text-gray-600" />}
                          {status === 'scheduled' && <ClockIcon className="w-5 h-5 text-blue-600" />}
                          <span className="font-medium capitalize">{status}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Schedule (shown when status is scheduled) */}
                {formData.status === 'scheduled' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
                    min="1"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Lower numbers appear first (1 = highest priority)
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">
                      {formData.image 
                        ? formData.image.name 
                        : 'Upload banner image (Recommended: 1920x600px)'}
                    </p>
                    <label className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200">
                      Browse Files
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        required={!editingBanner}
                        onChange={(e) => e.target.files?.[0] && setFormData({
                          ...formData,
                          image: e.target.files[0]
                        })}
                      />
                    </label>
                    {editingBanner?.imageUrl && !formData.image && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                        <div className="relative h-32 w-full rounded-lg overflow-hidden">
                          <img
                            src={editingBanner.imageUrl}
                            alt="Current"
                            className="w-full h-full object-cover"
                          />
                        </div>
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
                    {editingBanner ? 'Update Banner' : 'Create Banner'}
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