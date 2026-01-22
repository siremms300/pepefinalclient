'use client'

import { useState } from 'react'
import { 
  QuestionMarkCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  BookOpenIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

interface SupportTicket {
  id: string
  subject: string
  status: 'open' | 'pending' | 'resolved' | 'closed'
  createdAt: string
  lastUpdated: string
}

export default function UserHelpPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [showContactForm, setShowContactForm] = useState(false)
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    description: ''
  })

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How long does delivery take?',
      answer: 'Delivery times vary by location. In Lagos, delivery typically takes 30-45 minutes during normal hours. Outside Lagos, please allow 2-3 business days.',
      category: 'delivery'
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept card payments (Visa, Mastercard, Verve), bank transfers, and cash on delivery.',
      category: 'payment'
    },
    {
      id: '3',
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 10 minutes of placing it. After that, please contact customer support immediately.',
      category: 'orders'
    },
    {
      id: '4',
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer refunds for orders that were not delivered, arrived damaged, or were incorrect. Please contact support within 24 hours of delivery.',
      category: 'refunds'
    },
    {
      id: '5',
      question: 'How do I track my order?',
      answer: 'You can track your order from your dashboard. Once your order is shipped, you will receive a tracking link via SMS and email.',
      category: 'tracking'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'delivery', name: 'Delivery' },
    { id: 'payment', name: 'Payment' },
    { id: 'orders', name: 'Orders' },
    { id: 'refunds', name: 'Refunds' },
    { id: 'account', name: 'Account' }
  ]

  const contactMethods = [
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      details: '+234 800 123 4567',
      hours: 'Mon-Sun, 8AM-10PM'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      description: 'Send us an email',
      details: 'support@pepesbrunch.com',
      response: 'Response within 24 hours'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      description: 'Chat with our support team',
      details: 'Available 9AM-6PM',
      action: 'Start Chat'
    }
  ]

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle ticket submission
    alert('Support ticket submitted! We will contact you soon.')
    setShowContactForm(false)
    setTicketForm({ subject: '', category: '', description: '' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600">Get help with your account and orders</p>
        </div>
        <button
          onClick={() => setShowContactForm(true)}
          className="px-6 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
        >
          Contact Support
        </button>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactMethods.map((method, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-pepe-primary bg-opacity-10 rounded-lg">
                <method.icon className="w-6 h-6 text-pepe-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{method.title}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{method.details}</p>
              {method.hours && (
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {method.hours}
                </div>
              )}
              {method.response && (
                <p className="text-sm text-gray-600">{method.response}</p>
              )}
              {method.action && (
                <button className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  {method.action}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <QuestionMarkCircleIcon className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-pepe-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="border rounded-lg overflow-hidden">
                <button
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                  onClick={(e) => {
                    const content = e.currentTarget.nextElementSibling as HTMLElement
                    content.style.display = content.style.display === 'none' ? 'block' : 'none'
                  }}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <span className="text-gray-400">▼</span>
                </button>
                <div className="p-4 pt-0 border-t hidden bg-gray-50">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Help Articles */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center space-x-2 mb-6">
          <BookOpenIcon className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900">Help Articles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'How to Place an Order',
              description: 'Step-by-step guide to ordering from our platform',
              readTime: '3 min read'
            },
            {
              title: 'Understanding Delivery Charges',
              description: 'Learn how delivery fees are calculated',
              readTime: '2 min read'
            },
            {
              title: 'Managing Your Account',
              description: 'How to update profile and preferences',
              readTime: '4 min read'
            }
          ].map((article, index) => (
            <a
              key={index}
              href="#"
              className="p-4 border rounded-lg hover:border-pepe-primary hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{article.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="w-4 h-4 mr-1" />
                {article.readTime}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Contact Support</h2>
                  <p className="text-gray-600">We'll get back to you within 24 hours</p>
                </div>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitTicket} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                    placeholder="What do you need help with?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="delivery">Delivery Issue</option>
                    <option value="payment">Payment Problem</option>
                    <option value="order">Order Related</option>
                    <option value="account">Account Issue</option>
                    <option value="refund">Refund Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                    placeholder="Please provide detailed information about your issue..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Include order numbers, dates, and any relevant details
                  </p>
                </div>

                {/* File Attachment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-gray-600 mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Maximum file size: 5MB • Supported: JPG, PNG, PDF
                    </p>
                  </div>
                </div>

                {/* Urgent Request */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="urgent"
                    className="w-4 h-4 text-pepe-primary rounded focus:ring-pepe-primary"
                  />
                  <label htmlFor="urgent" className="ml-2 text-sm text-gray-700">
                    Mark as urgent (For time-sensitive issues only)
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
                  >
                    Submit Ticket
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