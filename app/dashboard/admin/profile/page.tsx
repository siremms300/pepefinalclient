'use client'

import { useState, useEffect } from 'react'
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CameraIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/context/authContext'

export default function AdminProfilePage() {
  const { user, updateUser } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        address: ''
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile
        })
      })

      const data = await response.json()
      
      if (data.success) {
        updateUser(data.data)
        setEditMode(false)
        alert('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        updateUser(data.data)
        alert('Profile picture updated!')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
    }
  }

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Password changed successfully!')
      } else {
        alert(data.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Failed to change password')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your admin profile</p>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pepe-primary to-pink-500 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="w-20 h-20 text-white" />
                  </div>
                )}
                
                {editMode && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50">
                    <CameraIcon className="w-5 h-5 text-gray-600" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                    />
                  </label>
                )}
              </div>

              {/* User Info */}
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 mb-2">{user?.role} • {user?.status}</p>
              
              <div className="flex items-center justify-center space-x-2 text-gray-500 mb-4">
                <EnvelopeIcon className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-gray-600">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">₦4.2M</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-xl shadow p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
            <button
              onClick={() => {
                const current = prompt('Enter current password:')
                const newPass = prompt('Enter new password:')
                const confirm = prompt('Confirm new password:')
                
                if (current && newPass && confirm && newPass === confirm) {
                  handlePasswordChange(current, newPass)
                } else {
                  alert('Passwords do not match or fields are empty')
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary disabled:bg-gray-50 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="flex-1 px-4 py-3 border rounded-lg bg-gray-50"
                  />
                  <div className="flex items-center text-green-600">
                    <CheckCircleIcon className="w-5 h-5 mr-1" />
                    <span className="text-sm">Verified</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    disabled={!editMode}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary disabled:bg-gray-50"
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </div>

              {/* Role Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Administrator</p>
                    <p className="text-sm text-gray-600">Full access to all features</p>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Admin
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status
                </label>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="font-medium text-gray-900">Active</p>
                      <p className="text-sm text-gray-600">Your account is active and working normally</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
              </div>

              {/* Last Login */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Activity
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">
                    Last login: <span className="font-medium">Today at 10:30 AM</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">IP Address: 192.168.1.1 • Lagos, Nigeria</p>
                </div>
              </div>

              {/* Action Buttons */}
              {editMode && (
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false)
                      if (user) {
                        setFormData({
                          name: user.name || '',
                          email: user.email || '',
                          mobile: user.mobile || '',
                          address: ''
                        })
                      }
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow mt-6 border border-red-200">
            <div className="p-6 border-b border-red-200">
              <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
              <p className="text-sm text-red-600">Irreversible actions</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Delete Account</p>
                    <p className="text-sm text-gray-600">
                      Permanently delete your admin account and all associated data
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure? This action cannot be undone.')) {
                        // Handle account deletion
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Account
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Deactivate Account</p>
                    <p className="text-sm text-gray-600">
                      Temporarily deactivate your account
                    </p>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}