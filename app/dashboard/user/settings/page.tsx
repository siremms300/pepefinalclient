'use client'

import { useState } from 'react'
import { 
  BellIcon, 
  EyeIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

export default function UserSettingsPage() {
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    newsletter: false,
    
    // Privacy Settings
    showProfile: true,
    showOrderHistory: true,
    allowTracking: true,
    
    // Language & Region
    language: 'en',
    timezone: 'Africa/Lagos',
    currency: 'NGN'
  })

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      alert('Account deletion request sent')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <BellIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email updates about your account' },
              { key: 'orderUpdates', label: 'Order Updates', description: 'Get notified about order status changes' },
              { key: 'promotionalEmails', label: 'Promotional Emails', description: 'Receive special offers and discounts' },
              { key: 'newsletter', label: 'Newsletter', description: 'Subscribe to our monthly newsletter' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onChange={(e) => setSettings({
                      ...settings,
                      [item.key]: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pepe-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[
              { key: 'showProfile', label: 'Show Profile', description: 'Allow others to see your public profile' },
              { key: 'showOrderHistory', label: 'Show Order History', description: 'Display your order history (anonymous)' },
              { key: 'allowTracking', label: 'Allow Tracking', description: 'Help improve our service by sharing usage data' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onChange={(e) => setSettings({
                      ...settings,
                      [item.key]: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pepe-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Language & Region */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Language & Region</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="yo">Yoruba</option>
                <option value="ig">Igbo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
              >
                <option value="Africa/Lagos">West Africa Time (UTC+1)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (UTC-5)</option>
                <option value="Europe/London">London (UTC+0)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
              >
                <option value="NGN">Nigerian Naira (₦)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow border border-red-200">
          <div className="p-6 border-b border-red-200">
            <div className="flex items-center space-x-2">
              <TrashIcon className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Delete Account</p>
                <p className="text-sm text-gray-600">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Download Data</p>
                <p className="text-sm text-gray-600">
                  Download a copy of your personal data
                </p>
              </div>
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Request Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}