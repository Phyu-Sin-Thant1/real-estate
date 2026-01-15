import React, { useEffect, useMemo, useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useUnifiedAuth } from '../context/UnifiedAuthContext'
import { loadFavorites, saveFavorites, loadHistory } from '../lib/helpers/userDataStorage'
import { loadSupportTickets } from '../lib/helpers/supportStorage'
import { userOrders } from '../mock/userOrders'
import Modal from '../components/common/Modal'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const MyPage = () => {
  const { user, isAuthenticated, isUser } = useUnifiedAuth()
  const [favorites, setFavorites] = useState([])
  const [history, setHistory] = useState([])
  const [supportTickets, setSupportTickets] = useState([])
  const [orders, setOrders] = useState([])

  // Modal states
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false)
  const [viewAllSavedModalOpen, setViewAllSavedModalOpen] = useState(false)
  const [viewAllActivityModalOpen, setViewAllActivityModalOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [settingsType, setSettingsType] = useState(null) // 'account' | 'notifications' | 'privacy'

  // Edit Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const fav = loadFavorites()
    if (fav.length === 0) {
      setFavorites([
        { id: 'fav-1', title: '강남역 인근 신축 오피스텔', location: '서울 강남구', price: '보증금 1억 / 월 90만', image: 'https://via.placeholder.com/300x200?text=Property' },
        { id: 'fav-2', title: '판교역 도보 5분 오피스', location: '경기 성남시', price: '매매 12억', image: 'https://via.placeholder.com/300x200?text=Property' }
      ])
    } else {
      setFavorites(fav)
    }

    const hist = loadHistory()
    if (hist.length === 0) {
      const now = new Date().toISOString()
      setHistory([
        { id: 'view-1', title: '여의도 리버뷰 아파트', viewedAt: now, propertyId: '1' },
        { id: 'view-2', title: '홍대역 근처 원룸', viewedAt: now, propertyId: '2' }
      ])
    } else {
      setHistory(hist)
    }

    const tickets = loadSupportTickets()
    setSupportTickets(tickets)

    setOrders(userOrders)
  }, [])

  // Initialize profile form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
  }, [user])

  const myTickets = useMemo(() => {
    if (!user?.email) return []
    return supportTickets.filter((t) => t.createdBy === user.email)
  }, [supportTickets, user?.email])

  // Calculate member since year
  const memberSinceYear = useMemo(() => {
    if (user?.loginAt) {
      return new Date(user.loginAt).getFullYear()
    }
    return 2023
  }, [user?.loginAt])

  // Get latest saved items (2-3 items)
  const latestSavedItems = useMemo(() => {
    return favorites.slice(0, 3)
  }, [favorites])

  // Get recent activity (latest 5 items)
  const recentActivity = useMemo(() => {
    const activities = []
    
    orders.forEach(order => {
      activities.push({
        id: `order-${order.id}`,
        type: 'Order',
        title: `Moving Service - ${order.orderNo}`,
        description: `${order.pickup} → ${order.destination}`,
        status: 'Completed',
        date: order.date,
        icon: 'truck'
      })
    })

    myTickets.slice(0, 3).forEach(ticket => {
      activities.push({
        id: `ticket-${ticket.id}`,
        type: 'Inquiry',
        title: ticket.type || 'Support Inquiry',
        description: ticket.message?.substring(0, 50) || 'Inquiry submitted',
        status: ticket.status || 'Open',
        date: ticket.createdAt || new Date().toISOString(),
        icon: 'message'
      })
    })

    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  }, [orders, myTickets])

  // Get all activity for modal
  const allActivity = useMemo(() => {
    const activities = []
    
    orders.forEach(order => {
      activities.push({
        id: `order-${order.id}`,
        type: 'Order',
        title: `Moving Service - ${order.orderNo}`,
        description: `${order.pickup} → ${order.destination}`,
        status: 'Completed',
        date: order.date,
        icon: 'truck',
        fullData: order
      })
    })

    myTickets.forEach(ticket => {
      activities.push({
        id: `ticket-${ticket.id}`,
        type: 'Inquiry',
        title: ticket.type || 'Support Inquiry',
        description: ticket.message || 'Inquiry submitted',
        status: ticket.status || 'Open',
        date: ticket.createdAt || new Date().toISOString(),
        icon: 'message',
        fullData: ticket
      })
    })

    return activities.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [orders, myTickets])

  const handleEditProfile = () => {
    setEditProfileModalOpen(true)
  }

  const handleSaveProfile = () => {
    // In a real app, this would save to backend
    console.log('Saving profile:', profileForm)
    setEditProfileModalOpen(false)
    // Reset password fields
    setProfileForm(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }))
  }

  const handleRemoveFavorite = (id) => {
    const updated = favorites.filter(f => f.id !== id)
    setFavorites(updated)
    saveFavorites(updated)
  }

  const handleOpenSettings = (type) => {
    setSettingsType(type)
    setSettingsModalOpen(true)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">접근 권한 없음</h3>
            <p className="text-red-600 mb-4">이 페이지에 접근하려면 로그인이 필요합니다.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <h1 className="text-[32px] font-bold text-gray-900 mb-8">마이페이지</h1>

        {/* 1. Profile Header Section */}
        <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Large Avatar */}
              <div className="w-24 h-24 rounded-full bg-dabang-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl text-dabang-primary font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              
              {/* User Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user?.name || '사용자'}
                </h2>
                <p className="text-base text-gray-600 mb-3">
                  {user?.email || '이메일 정보 없음'}
                </p>
                {/* Account Type Badge */}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Standard Member
                </span>
              </div>
            </div>
            
            {/* Edit Profile Button */}
            <button 
              onClick={handleEditProfile}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors mt-1"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* 2. Quick Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-[16px] border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">{favorites.length}</p>
            <p className="text-sm text-gray-500">Saved Properties</p>
          </div>
          
          <div className="bg-white rounded-[16px] border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">{orders.length}</p>
            <p className="text-sm text-gray-500">Orders / Requests</p>
          </div>
          
          <div className="bg-white rounded-[16px] border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">{myTickets.length}</p>
            <p className="text-sm text-gray-500">Inquiries Submitted</p>
          </div>
          
          <div className="bg-white rounded-[16px] border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">{memberSinceYear}</p>
            <p className="text-sm text-gray-500">Member Since</p>
          </div>
        </div>

        {/* 3. Saved Items Section */}
        <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Saved Items</h3>
            {favorites.length > 0 && (
              <button 
                onClick={() => setViewAllSavedModalOpen(true)}
                className="text-sm text-dabang-primary hover:text-dabang-primary/80 transition-colors"
              >
                View all saved
              </button>
            )}
          </div>

          {latestSavedItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">You haven't saved any properties yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestSavedItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-[12px] overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="relative h-40 bg-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.location}</p>
                    <p className="text-base font-semibold text-dabang-primary">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. User Activity Section */}
        <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Activity</h3>
            {recentActivity.length > 0 && (
              <button 
                onClick={() => setViewAllActivityModalOpen(true)}
                className="text-sm text-dabang-primary hover:text-dabang-primary/80 transition-colors"
              >
                View all activity
              </button>
            )}
          </div>

          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No recent activity to display.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    {activity.icon === 'truck' ? (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{activity.description}</p>
                      </div>
                      <span
                        className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'Completed' || activity.status === 'RESOLVED'
                            ? 'bg-green-100 text-green-700'
                            : activity.status === 'Open' || activity.status === 'OPEN'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(activity.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Settings & Preferences Section */}
        <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Settings & Preferences</h3>
          
          <div className="space-y-1">
            <button 
              onClick={() => handleOpenSettings('account')}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Account Settings</p>
                  <p className="text-xs text-gray-500">Manage your account information</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button 
              onClick={() => handleOpenSettings('notifications')}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Notification Preferences</p>
                  <p className="text-xs text-gray-500">Control how you receive updates</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button 
              onClick={() => handleOpenSettings('privacy')}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Privacy & Security</p>
                  <p className="text-xs text-gray-500">Manage your privacy and security settings</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Footer />

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
        title="Edit Profile"
        size="md"
      >
        <div className="space-y-6">
          <Input
            label="Name"
            id="name"
            type="text"
            value={profileForm.name}
            onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your name"
          />

          <Input
            label="Email"
            id="email"
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
          />

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-4">Change Password (Optional)</p>
            
            <div className="space-y-4">
              <Input
                label="Current Password"
                id="currentPassword"
                type="password"
                value={profileForm.currentPassword}
                onChange={(e) => setProfileForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />

              <Input
                label="New Password"
                id="newPassword"
                type="password"
                value={profileForm.newPassword}
                onChange={(e) => setProfileForm(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
              />

              <Input
                label="Confirm New Password"
                id="confirmPassword"
                type="password"
                value={profileForm.confirmPassword}
                onChange={(e) => setProfileForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              onClick={handleSaveProfile}
              className="flex-1"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditProfileModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* View All Saved Modal */}
      <Modal
        isOpen={viewAllSavedModalOpen}
        onClose={() => setViewAllSavedModalOpen(false)}
        title="All Saved Properties"
        size="lg"
      >
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">You haven't saved any properties yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{item.location}</p>
                  <p className="text-base font-semibold text-dabang-primary">{item.price}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => window.open(`/property/${item.id}`, '_blank')}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleRemoveFavorite(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* View All Activity Modal */}
      <Modal
        isOpen={viewAllActivityModalOpen}
        onClose={() => setViewAllActivityModalOpen(false)}
        title="All Activity"
        size="lg"
      >
        {allActivity.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No activity to display.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  {activity.icon === 'truck' ? (
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    </div>
                    <span
                      className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'Completed' || activity.status === 'RESOLVED'
                          ? 'bg-green-100 text-green-700'
                          : activity.status === 'Open' || activity.status === 'OPEN'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={settingsModalOpen}
        onClose={() => {
          setSettingsModalOpen(false)
          setSettingsType(null)
        }}
        title={
          settingsType === 'account' ? 'Account Settings' :
          settingsType === 'notifications' ? 'Notification Preferences' :
          settingsType === 'privacy' ? 'Privacy & Security' :
          'Settings'
        }
        size="md"
      >
        {settingsType === 'account' && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Manage your account information and preferences.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-2">Membership Type</p>
                  <p className="text-base text-gray-700">Standard Member</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-2">Email</p>
                  <p className="text-base text-gray-700">{user?.email || 'N/A'}</p>
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                setSettingsModalOpen(false)
                setSettingsType(null)
              }}
              className="w-full"
            >
              Close
            </Button>
          </div>
        )}

        {settingsType === 'notifications' && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Control how you receive notifications and updates.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dabang-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-xs text-gray-500">Receive updates via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dabang-primary"></div>
                  </label>
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                setSettingsModalOpen(false)
                setSettingsType(null)
              }}
              className="w-full"
            >
              Save Preferences
            </Button>
          </div>
        )}

        {settingsType === 'privacy' && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Manage your privacy and security settings.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-2">Data Privacy</p>
                  <p className="text-xs text-gray-600">
                    Your data is protected and used in accordance with our privacy policy.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-2">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-600 mb-3">
                    Add an extra layer of security to your account.
                  </p>
                  <Button variant="outline" size="small">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                setSettingsModalOpen(false)
                setSettingsType(null)
              }}
              className="w-full"
            >
              Close
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MyPage