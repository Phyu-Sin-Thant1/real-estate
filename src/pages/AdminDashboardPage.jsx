import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const NAV_ITEMS = [
  { label: 'Dashboard Overview', icon: '🏠', badge: null },
  { label: 'News Management', icon: '📰', badge: 12 },
  { label: 'Market Insights', icon: '💹', badge: null },
  { label: 'Real Estate Listings', icon: '🏡', badge: 24 },
  { label: 'Analytics', icon: '📊', badge: null },
  { label: 'Users Management', icon: '👥', badge: null },
  { label: 'Settings', icon: '⚙️', badge: null },

]

const CATEGORY_OPTIONS = ['All', 'Political', 'Business', 'Real Estate', 'Tech', 'Lifestyle']
const STATUS_OPTIONS = ['All', 'Published', 'Draft']

const NEWS_ITEMS = [
  {
    id: 'news-1042',
    title: 'Seoul Luxury Towers Complete Phase II Expansion',
    category: 'Real Estate',
    author: 'Min-ji Park',
    publishedAt: '2025-11-10',
    status: 'Published',
    thumbnail:
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'news-1041',
    title: 'Commercial Leasing Rates Climb in Gangnam',
    category: 'Business',
    author: 'Sung-ho Kim',
    publishedAt: '2025-11-08',
    status: 'Draft',
    thumbnail:
      'https://images.unsplash.com/photo-1529429617124-aee111b4d5f4?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'news-1040',
    title: 'Government Updates Housing Loan Subsidies',
    category: 'Political',
    author: 'Hana Choi',
    publishedAt: '2025-11-05',
    status: 'Published',
    thumbnail:
      'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'news-1039',
    title: 'Smart Home Adoption Doubles in New Developments',
    category: 'Tech',
    author: 'Grace Lee',
    publishedAt: '2025-10-31',
    status: 'Published',
    thumbnail:
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'news-1038',
    title: 'Han River Waterfront District Plans Revealed',
    category: 'Real Estate',
    author: 'Anthony Park',
    publishedAt: '2025-10-27',
    status: 'Draft',
    thumbnail:
      'https://images.unsplash.com/photo-1529429617124-aee111b4d5f4?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'news-1037',
    title: 'Jeju Resort Market Sees Record Occupancy',
    category: 'Business',
    author: 'Yoon-hee Min',
    publishedAt: '2025-10-24',
    status: 'Published',
    thumbnail:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'news-1036',
    title: 'Eco-Friendly Condominiums Gain Traction Nationwide',
    category: 'Lifestyle',
    author: 'Dae-hyun Song',
    publishedAt: '2025-10-18',
    status: 'Published',
    thumbnail:
      'https://images.unsplash.com/photo-1529429617124-aee111b4d5f4?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'news-1035',
    title: 'AI Personalization Comes to Property Portals',
    category: 'Tech',
    author: 'Myint Thu',
    publishedAt: '2025-10-12',
    status: 'Draft',
    thumbnail:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=240&q=80',
  },
]

const EMPTY_FORM_STATE = {
  title: '',
  category: 'Real Estate',
  description: '',
  status: 'Draft',
  thumbnail: '',
}

const DASHBOARD_KPIS = [
  {
    label: 'Total Articles',
    value: '1,284',
    delta: '+12.4%',
    tone: 'up',
    description: 'News + market coverage past 30 days',
  },
  {
    label: 'Active Listings',
    value: '842',
    delta: '+5.6%',
    tone: 'up',
    description: 'Live rental & sales listings',
  },
  {
    label: 'Companies Verified',
    value: '312',
    delta: '+3.2%',
    tone: 'up',
    description: 'Agency & developer accounts',
  },
  {
    label: 'Daily Active Users',
    value: '24,560',
    delta: '+9.8%',
    tone: 'up',
    description: 'Cross-language traffic (KR/MM/EN)',
  },
  {
    label: 'Pending Approvals',
    value: '37',
    delta: '-4.1%',
    tone: 'down',
    description: 'Reviews awaiting action',
  },
  {
    label: 'Ad Revenue',
    value: '₩58.2M',
    delta: '+18.5%',
    tone: 'up',
    description: 'Programmatic + native (MTD)',
  },
]

const RECENT_ACTIVITY = [
  {
    id: 'act-1',
    type: 'Article',
    emoji: '📰',
    title: 'City skyline guide 2025',
    author: 'Grace Lee',
    time: '12m ago',
  },
  {
    id: 'act-2',
    type: 'Listing',
    emoji: '🏡',
    title: 'Han River penthouse',
    author: 'Anthony Park',
    time: '28m ago',
  },
  {
    id: 'act-3',
    type: 'Company',
    emoji: '🏢',
    title: 'SK Real Estate verified',
    author: 'Compliance Bot',
    time: '1h ago',
  },
  {
    id: 'act-4',
    type: 'Article',
    emoji: '💹',
    title: 'Market outlook Q1',
    author: 'Min-ji Park',
    time: '2h ago',
  },
]

const REVIEW_QUEUE = [
  {
    id: 'rev-1',
    title: 'Seoul loft collection',
    owner: 'Ji-won Han',
    type: 'Listing',
    submitted: '35m ago',
  },
  {
    id: 'rev-2',
    title: 'Inflation protection strategies',
    owner: 'Aung Thura',
    type: 'Article',
    submitted: '58m ago',
  },
  {
    id: 'rev-3',
    title: 'Busan shoreline villas',
    owner: 'Myint Thu',
    type: 'Listing',
    submitted: '1h 15m ago',
  },
  {
    id: 'rev-4',
    title: 'Smart home adoption stats',
    owner: 'Grace Lee',
    type: 'Article',
    submitted: '2h 02m ago',
  },
]

const LATEST_NEWS = [
  { id: 'news-1', title: 'Metro transit expansion to boost rentals', category: 'Business', status: 'Published', updated: '12m ago' },
  { id: 'news-2', title: 'Han River luxury towers release schedule', category: 'Real Estate', status: 'Scheduled', updated: '32m ago' },
  { id: 'news-3', title: 'Yangon condo market recovery signals', category: 'Market', status: 'Draft', updated: '1h ago' },
  { id: 'news-4', title: 'Eco-smart homes trending in Busan', category: 'Lifestyle', status: 'Published', updated: '2h ago' },
  { id: 'news-5', title: 'Mortgage rules updated for 2025 buyers', category: 'Policy', status: 'Published', updated: '4h ago' },
]

const LATEST_LISTINGS = [
  { id: 'list-1', name: 'Luxe Garden Villas', location: 'Songpa-gu, Seoul', price: '₩1.25B', status: 'Live' },
  { id: 'list-2', name: 'Skyline Residences', location: 'Myeongdong, Seoul', price: '₩980M', status: 'Pending QA' },
  { id: 'list-3', name: 'Jeju Harbor Suites', location: 'Jeju-si, Jeju', price: '₩3.8M / month', status: 'Live' },
  { id: 'list-4', name: 'Downtown Offices', location: 'Yangon CBD', price: '₩2.6M / month', status: 'Draft' },
  { id: 'list-5', name: 'Han River Penthouse', location: 'Yeouido, Seoul', price: '₩4.9B', status: 'Review' },
]

const DASHBOARD_CHECKLIST = [
  { id: 'chk-1', label: 'Connect Maps API', description: 'Enable location intelligence & heat overlays', cta: 'Configure maps' },
  { id: 'chk-2', label: 'Create content categories', description: 'Align KR/MM/EN taxonomy for newsroom', cta: 'Manage categories' },
  { id: 'chk-3', label: 'Invite staff & reviewers', description: 'Add editors, agents, and compliance leads', cta: 'Invite team' },
]

const LISTING_CATEGORIES = ['All', 'Apartment', 'House', 'Condo', 'Land', 'Commercial']
const LISTING_STATUS = ['All', 'Published', 'Draft', 'Sold', 'Pending']
const LISTING_LOCATIONS = ['All', 'Seoul', 'Busan', 'Incheon', 'Jeju', 'Yangon']

const LISTING_FEATURES = ['Has parking', 'Balcony', 'Garden', 'Pet friendly', 'Furnished', 'Rooftop access']

const LISTINGS_DATA = [
  {
    id: 'listing-1042',
    title: 'Skyline Residences 3BR Panorama',
    category: 'Apartment',
    status: 'Published',
    location: 'Seoul · Gangnam-gu',
    address: '23 Teheran-ro, Gangnam-gu, Seoul',
    price: '₩1,290,000,000',
    type: 'Apartment',
    datePosted: '2025-11-09',
    thumbnail: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80',
    features: ['Has parking', 'Balcony', 'Pet friendly'],
    coordinates: { lat: 37.498, lng: 127.028 },
    gallery: [
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'listing-1039',
    title: 'Han River Penthouse Collection',
    category: 'House',
    status: 'Pending',
    location: 'Seoul · Yeouido',
    address: '77 Yeoui-daero, Yeongdeungpo-gu, Seoul',
    price: '₩4,750,000,000',
    type: 'House',
    datePosted: '2025-11-08',
    thumbnail: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=400&q=80',
    features: ['Has parking', 'Balcony', 'Garden', 'Rooftop access'],
    coordinates: { lat: 37.524, lng: 126.927 },
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'listing-1035',
    title: 'Jeju Harbor Suites Ocean View',
    category: 'Condo',
    status: 'Published',
    location: 'Jeju · Jeju-si',
    address: '120 Seogwang-ro, Jeju-si, Jeju',
    price: '₩3,800,000 / month',
    type: 'Condo',
    datePosted: '2025-11-06',
    thumbnail: 'https://images.unsplash.com/photo-1505692794403-55b39b35c8d2?auto=format&fit=crop&w=400&q=80',
    features: ['Has parking', 'Balcony'],
    coordinates: { lat: 33.499, lng: 126.531 },
    gallery: [
      'https://images.unsplash.com/photo-1512914890250-353c97c9e35c?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'listing-1031',
    title: 'Downtown Offices Tower B',
    category: 'Commercial',
    status: 'Draft',
    location: 'Yangon · CBD',
    address: '45 Maha Bandula Rd, Yangon',
    price: '₩2,450,000 / month',
    type: 'Commercial',
    datePosted: '2025-11-02',
    thumbnail: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=400&q=80',
    features: ['Has parking'],
    coordinates: { lat: 16.779, lng: 96.161 },
    gallery: [
      'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'listing-1029',
    title: 'Busan Marina View Duplex',
    category: 'Apartment',
    status: 'Sold',
    location: 'Busan · Haeundae',
    address: '37 Dalmaji-gil, Haeundae-gu, Busan',
    price: '₩890,000,000',
    type: 'Apartment',
    datePosted: '2025-10-28',
    thumbnail: 'https://images.unsplash.com/photo-1486304873000-235643847519?auto=format&fit=crop&w=400&q=80',
    features: ['Balcony', 'Garden'],
    coordinates: { lat: 35.163, lng: 129.163 },
    gallery: [],
  },
  {
    id: 'listing-1024',
    title: 'Incheon Logistics Hub Lot 4',
    category: 'Land',
    status: 'Published',
    location: 'Incheon · Songdo',
    address: '255 Convensia-daero, Yeonsu-gu, Incheon',
    price: '₩2,980,000,000',
    type: 'Land',
    datePosted: '2025-10-17',
    thumbnail: 'https://images.unsplash.com/photo-1505691935710-6bfe8f1559d7?auto=format&fit=crop&w=400&q=80',
    features: ['Has parking'],
    coordinates: { lat: 37.389, lng: 126.644 },
    gallery: [],
  },
  {
    id: 'listing-1018',
    title: 'Premium Serviced Studio',
    category: 'Apartment',
    status: 'Published',
    location: 'Seoul · Mapo-gu',
    address: '12 World Cup-ro, Mapo-gu, Seoul',
    price: '₩1,850,000 / month',
    type: 'Apartment',
    datePosted: '2025-10-09',
    thumbnail: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=400&q=80',
    features: ['Has parking', 'Furnished'],
    coordinates: { lat: 37.566, lng: 126.907 },
    gallery: [],
  },
  {
    id: 'listing-1015',
    title: 'Heritage Hanok Retreat',
    category: 'House',
    status: 'Draft',
    location: 'Seoul · Jongno-gu',
    address: '124 Bukchon-ro, Jongno-gu, Seoul',
    price: '₩3,450,000,000',
    type: 'House',
    datePosted: '2025-10-01',
    thumbnail: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=400&q=80',
    features: ['Garden'],
    coordinates: { lat: 37.582, lng: 126.983 },
    gallery: [],
  },
]

const LISTING_FORM_STATE = {
  title: '',
  category: 'Apartment',
  price: '',
  address: '',
  description: '',
  status: 'Draft',
  features: [],
  location: 'Seoul',
}

const MARKET_KPIS = [
  {
    label: 'Average Property Price',
    icon: '📈',
    value: '$682,000',
    delta: '+4.2%',
    tone: 'up',
    spark: [62, 65, 63, 67, 69, 68, 70],
  },
  {
    label: 'Most Active Region',
    icon: '🏙️',
    value: 'Seoul · Gangnam-gu',
    delta: '+12.8%',
    tone: 'up',
    spark: [48, 52, 56, 61, 64, 66, 72],
  },
  {
    label: 'Listings Growth',
    icon: '🏠',
    value: '+18.6%',
    delta: '+2.4 pts',
    tone: 'up',
    spark: [22, 24, 25, 26, 27, 30, 31],
  },
  {
    label: 'Average Rental Yield',
    icon: '💰',
    value: '6.8%',
    delta: '-0.4%',
    tone: 'down',
    spark: [7.2, 7.1, 7.05, 6.95, 6.9, 6.85, 6.8],
  },
]

const MARKET_PRICE_SERIES = {
  Apartments: [640, 648, 655, 663, 671, 677, 682],
  Houses: [710, 705, 700, 698, 704, 713, 721],
  Condos: [520, 525, 530, 534, 540, 548, 555],
  Land: [460, 468, 471, 476, 480, 485, 489],
}

const MARKET_REGIONS = [
  { id: 'reg-1', name: 'Seoul · Gangnam-gu', avgPrice: '$1.15M', growth: '+8.4%', demand: 'High' },
  { id: 'reg-2', name: 'Busan · Haeundae', avgPrice: '$752K', growth: '+6.2%', demand: 'Rising' },
  { id: 'reg-3', name: 'Jeju · Seogwipo', avgPrice: '$612K', growth: '+4.1%', demand: 'Stable' },
  { id: 'reg-4', name: 'Incheon · Songdo', avgPrice: '$498K', growth: '+5.6%', demand: 'High' },
  { id: 'reg-5', name: 'Yangon · Downtown', avgPrice: '$310K', growth: '+3.8%', demand: 'Emerging' },
]

const MARKET_NEWS = NEWS_ITEMS.filter((item) =>
  ['Market', 'Business', 'Political', 'Economy'].some((tag) => item.category.includes(tag))
).slice(0, 4)

const MARKET_TABS = [
  { key: 'demand', label: 'Property Demand' },
  { key: 'sellingTime', label: 'Average Selling Time' },
  { key: 'roi', label: 'Investment Return (%)' },
]

const MARKET_DATE_OPTIONS = ['This week', 'This month', 'Last 3 months', 'Custom range']

const ANALYTICS_KPIS = [
  {
    label: 'Total Listings',
    icon: '🏠',
    value: '1,284',
    delta: '+12.4%',
    tone: 'up',
    spark: [52, 60, 55, 69, 58, 74, 65, 78],
  },
  {
    label: 'Active Users',
    icon: '👤',
    value: '24,560',
    delta: '+9.8%',
    tone: 'up',
    spark: [16, 24, 18, 28, 21, 30, 23, 29],
  },
  {
    label: 'Listings Created (M)',
    icon: '📈',
    value: '326',
    delta: '+5.6%',
    tone: 'up',
    spark: [18, 33, 24, 35, 26, 31, 28, 36],
  },
  {
    label: 'Total Revenue',
    icon: '💰',
    value: '$182K',
    delta: '+6.2%',
    tone: 'up',
    spark: [20, 26, 24, 32, 23, 34, 27, 38],
  },
  {
    label: 'Inquiries',
    icon: '🔔',
    value: '3,742',
    delta: '+3.1%',
    tone: 'up',
    spark: [42, 49, 45, 57, 44, 60, 52, 66],
  },
  {
    label: 'Avg. Response Time',
    icon: '⚡',
    value: '2h 18m',
    delta: '-0.6h',
    tone: 'down',
    spark: [3.9, 3.3, 3.6, 2.9, 3.1, 2.5, 2.8, 2.2],
  },
]

const USERS_ROLES = ['All', 'Admin', 'Editor', 'Agent', 'End-user']
const USERS_STATUS = ['All', 'Active', 'Inactive', 'Suspended']
const USER_SEGMENTS = ['All Users', 'Staffs', 'End-users']
const LANGUAGE_OPTIONS = ['EN', 'KR', 'MM', 'MN']

const USERS_DATA = [
  {
    id: 'user-1042',
    name: 'Grace Lee',
    email: 'grace.lee@tofu.com',
    phone: '+82 10-1234-5678',
    role: 'Admin',
    status: 'Active',
    joined: '2025-08-14',
    avatar: 'https://i.pravatar.cc/120?img=47',
    lastLogin: '15 minutes ago',
  },
  {
    id: 'user-1041',
    name: 'Anthony Park',
    email: 'anthony.park@tofu.com',
    phone: '+82 10-8765-4321',
    role: 'Editor',
    status: 'Active',
    joined: '2025-06-22',
    avatar: '',
    lastLogin: '1 hour ago',
  },
  {
    id: 'user-1038',
    name: 'Myint Thu',
    email: 'myint.thu@tofu.com',
    phone: '+95 9-876-543-210',
    role: 'Agent',
    status: 'Suspended',
    joined: '2025-05-30',
    avatar: 'https://i.pravatar.cc/120?img=12',
    lastLogin: 'Suspended',
  },
  {
    id: 'user-1035',
    name: 'Min-ji Park',
    email: 'minji.park@tofu.com',
    phone: '+82 10-1111-2222',
    role: 'Editor',
    status: 'Inactive',
    joined: '2025-04-18',
    avatar: '',
    lastLogin: '3 weeks ago',
  },
  {
    id: 'user-1032',
    name: 'Hana Choi',
    email: 'hana.choi@tofu.com',
    phone: '+82 10-3333-4444',
    role: 'Agent',
    status: 'Active',
    joined: '2025-02-09',
    avatar: 'https://i.pravatar.cc/120?img=31',
    lastLogin: 'Yesterday',
  },
  {
    id: 'user-1029',
    name: 'James Kim',
    email: 'james.kim@tofu.com',
    phone: '+1 415-202-9011',
    role: 'End-user',
    status: 'Active',
    joined: '2025-01-22',
    avatar: '',
    lastLogin: '2 days ago',
  },
  {
    id: 'user-1024',
    name: 'Selena Wong',
    email: 'selena.wong@tofu.com',
    phone: '+82 10-5555-6666',
    role: 'Agent',
    status: 'Active',
    joined: '2024-12-14',
    avatar: 'https://i.pravatar.cc/120?img=21',
    lastLogin: '5 hours ago',
  },
  {
    id: 'user-1020',
    name: 'Alex Tan',
    email: 'alex.tan@tofu.com',
    phone: '+65 8123 4567',
    role: 'End-user',
    status: 'Inactive',
    joined: '2024-11-05',
    avatar: '',
    lastLogin: '1 month ago',
  },
]

const SETTINGS_TABS = [
  { key: 'general', icon: '🛠️', label: 'General' },
  { key: 'branding', icon: '🎨', label: 'Branding' },
  { key: 'content', icon: '🗂️', label: 'Content & Categories' },
  { key: 'integrations', icon: '🔌', label: 'Integrations' },
  { key: 'localization', icon: '🌐', label: 'Localization' },
  { key: 'notifications', icon: '📬', label: 'Notifications' },
  { key: 'security', icon: '🔒', label: 'Security & Roles' },
  { key: 'system', icon: '🖥️', label: 'System Info' },
]

const BRAND_COLORS = ['#5D45DC', '#006CA6', '#0F172A', '#E11D48', '#16A34A']
const BRAND_SECONDARY = ['#AE9FFF', '#38BDF8', '#CBD5F5', '#F9A8D4', '#A7F3D0']
const BRAND_FONTS = ['Inter', 'Noto Sans', 'Pretendard']

const ANALYTICS_DATE_OPTIONS = ['Today', 'This Week', 'This Month', 'Custom']

const ANALYTICS_LISTINGS = [
  { id: 'ana-1', name: 'Skyline Residences', views: '18,240', inquiries: '420', timeOn: '3m 42s', status: 'Published' },
  { id: 'ana-2', name: 'Han River Penthouse', views: '12,680', inquiries: '305', timeOn: '4m 10s', status: 'Published' },
  { id: 'ana-3', name: 'Jeju Harbor Suites', views: '9,540', inquiries: '188', timeOn: '2m 55s', status: 'Pending QA' },
  { id: 'ana-4', name: 'Busan Marina Duplex', views: '8,320', inquiries: '146', timeOn: '3m 18s', status: 'Draft' },
  { id: 'ana-5', name: 'Downtown Offices B', views: '7,910', inquiries: '122', timeOn: '2m 37s', status: 'Published' },
]

const ANALYTICS_AGENTS = [
  { id: 'agent-1', name: 'Grace Lee', listings: 52, inquiries: 182, score: 97 },
  { id: 'agent-2', name: 'Anthony Park', listings: 47, inquiries: 168, score: 92 },
  { id: 'agent-3', name: 'Min-ji Park', listings: 36, inquiries: 134, score: 89 },
  { id: 'agent-4', name: 'Myint Thu', listings: 33, inquiries: 120, score: 85 },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const SidebarNav = ({ collapsed, activeItem, onSelect }) => (
    <nav className="mt-10 space-y-1 px-3">
      {NAV_ITEMS.map((item) => {
        const isActive = item.label === activeItem
        return (
          <button
            key={item.label}
          onClick={() => onSelect?.(item.label)}
            className={classNames(
              'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200',
              collapsed ? 'justify-center px-0' : 'justify-start',
              isActive
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200/60'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <span className="text-lg">{item.icon}</span>
          {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
            {!collapsed && item.badge !== null && (
              <span
                className={classNames(
                'rounded-full bg-indigo-50 px-2 text-xs font-semibold text-indigo-600',
                isActive && 'bg-white text-indigo-600'
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )

const SidebarFooter = ({ collapsed }) => (
    <div className="mt-auto space-y-3 px-4 pb-6">
      <div
        className={classNames(
        'rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 px-4 py-5 text-white shadow-xl shadow-indigo-900/20',
          collapsed && 'px-3 py-4 text-center'
        )}
      >
      <p className="text-xs uppercase tracking-wide text-indigo-100/90">
        Editorial Support
        </p>
        {!collapsed && (
          <>
          <p className="mt-1 text-sm font-semibold">Need newsroom assistance?</p>
            <button className="mt-3 rounded-full bg-white/15 px-3 py-1 text-xs font-medium hover:bg-white/25">
            Contact editor
            </button>
          </>
        )}
      </div>
    <div className="text-[10px] text-slate-400">
        {!collapsed ? (
          <p>
            © {new Date().getFullYear()} TOFU 01 Portal
            <br />
          Editorial Console
          </p>
        ) : (
          <p className="text-center">© {new Date().getFullYear()}</p>
        )}
      </div>
    </div>
  )

const StatusBadge = ({ status }) => {
  const map = {
    Published: 'bg-emerald-100 text-emerald-700 ring-emerald-200/60',
    Draft: 'bg-slate-100 text-slate-600 ring-slate-200/60',
    Scheduled: 'bg-sky-100 text-sky-700 ring-sky-200/60',
    'Pending review': 'bg-amber-100 text-amber-700 ring-amber-200/60',
    Review: 'bg-amber-100 text-amber-700 ring-amber-200/60',
    'Pending QA': 'bg-amber-100 text-amber-700 ring-amber-200/60',
    Live: 'bg-emerald-100 text-emerald-700 ring-emerald-200/60',
    Pending: 'bg-amber-100 text-amber-700 ring-amber-200/60',
    Sold: 'bg-slate-200 text-slate-600 ring-slate-300/60',
  }

  return (
    <span
      className={classNames(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
        map[status] || map.Draft
      )}
    >
      <span className="text-[10px]">•</span>
      {status}
    </span>
  )
}

const StatusToggle = ({ value, onChange }) => (
  <div className="inline-grid grid-cols-2 overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold">
    {['Draft', 'Published'].map((option) => (
        <button
        key={option}
        type="button"
        onClick={() => onChange(option)}
        className={classNames(
          'px-3 py-1.5 transition',
          value === option
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        )}
      >
        {option}
        </button>
    ))}
    </div>
  )

const ModalShell = ({ title, description, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8">
    <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl shadow-slate-900/20">
      <div className="flex items-start justify-between border-b border-slate-200 px-8 py-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
        <button
          onClick={onClose}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700"
        >
          Close
    </button>
      </div>
      <div className="px-8 py-6">{children}</div>
    </div>
  </div>
)

const DeleteConfirm = ({ open, onCancel, onConfirm, itemTitle, entityLabel = 'this item' }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl shadow-slate-900/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-2xl">
          🗑️
    </div>
        <h2 className="mt-6 text-xl font-semibold text-slate-900">
          Are you sure you want to delete {entityLabel}?
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          This action cannot be undone.{' '}
          {itemTitle && (
            <span className="font-semibold text-slate-900">"{itemTitle}"</span>
          )}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600 sm:w-auto"
          >
            Delete
          </button>
        </div>
      </div>
        </div>
  )
}

const RichTextEditor = ({ value, onChange }) => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-inner shadow-slate-100">
    <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 text-slate-500">
      {[
        { label: 'Bold', icon: 'B' },
        { label: 'Italic', icon: 'I' },
        { label: 'Underline', icon: 'U' },
        { label: 'Link', icon: '🔗' },
        { label: 'List', icon: '•' },
      ].map((item) => (
        <button
          key={item.label}
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
          aria-label={item.label}
        >
          <span className={classNames(item.icon.length > 1 ? 'text-sm' : 'text-base font-semibold')}>
            {item.icon}
          </span>
        </button>
      ))}
      </div>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Compose the news story, add quotes, and highlight key market insights..."
      className="h-40 w-full resize-none rounded-2xl border-none px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-0"
    />
  </div>
)

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [collapsed, setCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('Dashboard Overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_OPTIONS[0])
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTIONS[0])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedNews, setSelectedNews] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [modalForm, setModalForm] = useState(EMPTY_FORM_STATE)
  const [thumbnailPreview, setThumbnailPreview] = useState('')

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [newsToDelete, setNewsToDelete] = useState(null)

  const [listingsView, setListingsView] = useState('table')
  const [listingSearch, setListingSearch] = useState('')
  const [listingCategoryFilter, setListingCategoryFilter] = useState(LISTING_CATEGORIES[0])
  const [listingStatusFilter, setListingStatusFilter] = useState(LISTING_STATUS[0])
  const [listingLocationFilter, setListingLocationFilter] = useState(LISTING_LOCATIONS[0])
  const [listingDateFilter, setListingDateFilter] = useState('')
  const [selectedListings, setSelectedListings] = useState([])
  const [listingPage, setListingPage] = useState(1)
  const [listingModalOpen, setListingModalOpen] = useState(false)
  const [listingModalMode, setListingModalMode] = useState('create')
  const [listingForm, setListingForm] = useState({ ...LISTING_FORM_STATE })
  const [listingImages, setListingImages] = useState([])
  const [listingFeatureSelections, setListingFeatureSelections] = useState([])
  const [listingToDelete, setListingToDelete] = useState(null)
  const [listingDeleteOpen, setListingDeleteOpen] = useState(false)

  const [marketCategory, setMarketCategory] = useState('Apartments')
  const [marketTab, setMarketTab] = useState(MARKET_TABS[0].key)
  const [marketDateRange, setMarketDateRange] = useState('This month')

  const [analyticsDateRange, setAnalyticsDateRange] = useState('This Month')
  const [analyticsTab, setAnalyticsTab] = useState('userActivity')

  const [usersSearch, setUsersSearch] = useState('')
  const [usersRoleFilter, setUsersRoleFilter] = useState(USERS_ROLES[0])
  const [usersStatusFilter, setUsersStatusFilter] = useState(USERS_STATUS[0])
  const [usersDateFilter, setUsersDateFilter] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [usersPage, setUsersPage] = useState(1)
  const [usersModalOpen, setUsersModalOpen] = useState(false)
  const [usersModalMode, setUsersModalMode] = useState('create')
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Agent',
    status: 'Active',
    password: '',
  })
  const [userToDelete, setUserToDelete] = useState(null)
  const [userDeleteOpen, setUserDeleteOpen] = useState(false)

  const [settingsTab, setSettingsTab] = useState(SETTINGS_TABS[0].key)
  const [brandPrimary, setBrandPrimary] = useState(BRAND_COLORS[0])
  const [brandSecondary, setBrandSecondary] = useState(BRAND_SECONDARY[0])
  const [brandFont, setBrandFont] = useState(BRAND_FONTS[0])
  const [themeMode, setThemeMode] = useState('Light')
  const [pendingChanges, setPendingChanges] = useState(false)
  const [userSegment, setUserSegment] = useState(USER_SEGMENTS[0])
  const [interfaceLanguage, setInterfaceLanguage] = useState(LANGUAGE_OPTIONS[0])

  const pageSize = 6

const adminName = user?.name || 'TOFU Admin'
  const adminEmail = user?.email || 'admin@tofu.com'
  const adminInitials = useMemo(() => {
  if (!adminName) return 'TA'
    return adminName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [adminName])

const filteredNews = useMemo(() => {
  const term = searchTerm.trim().toLowerCase()
  return NEWS_ITEMS.filter((item) => {
    const matchTerm =
      term.length === 0 ||
      item.title.toLowerCase().includes(term) ||
      item.author.toLowerCase().includes(term)

    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchStatus = selectedStatus === 'All' || item.status === selectedStatus

    const itemDate = new Date(item.publishedAt)
    const matchDateFrom = dateFrom ? itemDate >= new Date(dateFrom) : true
    const matchDateTo = dateTo ? itemDate <= new Date(dateTo) : true

    return matchTerm && matchCategory && matchStatus && matchDateFrom && matchDateTo
  })
}, [searchTerm, selectedCategory, selectedStatus, dateFrom, dateTo])

const totalPages = Math.max(1, Math.ceil(filteredNews.length / pageSize))
const paginatedNews = useMemo(() => {
  const start = (currentPage - 1) * pageSize
  return filteredNews.slice(start, start + pageSize)
}, [filteredNews, currentPage])

const isAllSelected =
  paginatedNews.length > 0 && paginatedNews.every((item) => selectedNews.includes(item.id))

const listingsPageSize = 6

const filteredListings = useMemo(() => {
  const term = listingSearch.trim().toLowerCase()
  return LISTINGS_DATA.filter((listing) => {
    const matchesTerm =
      term.length === 0 ||
      listing.title.toLowerCase().includes(term) ||
      listing.address.toLowerCase().includes(term) ||
      listing.location.toLowerCase().includes(term)

    const matchesCategory =
      listingCategoryFilter === 'All' || listing.category === listingCategoryFilter

    const matchesStatus =
      listingStatusFilter === 'All' || listing.status === listingStatusFilter

    const matchesLocation =
      listingLocationFilter === 'All' || listing.location.toLowerCase().includes(listingLocationFilter.toLowerCase())

    const listingDate = new Date(listing.datePosted)
    const matchesDate = listingDateFilter ? listingDate >= new Date(listingDateFilter) : true

    return matchesTerm && matchesCategory && matchesStatus && matchesLocation && matchesDate
  })
}, [listingSearch, listingCategoryFilter, listingStatusFilter, listingLocationFilter, listingDateFilter])

const totalListingPages = Math.max(1, Math.ceil(filteredListings.length / listingsPageSize))

const paginatedListings = useMemo(() => {
  const start = (listingPage - 1) * listingsPageSize
  return filteredListings.slice(start, start + listingsPageSize)
}, [filteredListings, listingPage])

const isAllListingsSelected =
  paginatedListings.length > 0 &&
  paginatedListings.every((listing) => selectedListings.includes(listing.id))

const listingPageNumbers = Array.from({ length: totalListingPages }, (_, index) => index + 1)
const listingRangeStart =
  filteredListings.length === 0 ? 0 : (listingPage - 1) * listingsPageSize + 1
const listingRangeEnd = (listingPage - 1) * listingsPageSize + paginatedListings.length

const activeMarketSeries = useMemo(() => MARKET_PRICE_SERIES[marketCategory] || [], [marketCategory])
const marketChartPaths = useMemo(() => {
  if (activeMarketSeries.length === 0) {
    return { line: '', area: '' }
  }
  const max = Math.max(...activeMarketSeries)
  const min = Math.min(...activeMarketSeries)
  const span = max - min || 1
  const coords = activeMarketSeries.map((value, index) => {
    const x =
      activeMarketSeries.length === 1
        ? 100
        : (index / (activeMarketSeries.length - 1)) * 100
    const y = 100 - ((value - min) / span) * 80 - 10
    return { x: x.toFixed(2), y: y.toFixed(2) }
  })
  const line = coords
    .map((pt, index) => `${index === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`)
    .join(' ')
  const area = ['M 0,100', coords.map((pt) => `L ${pt.x},${pt.y}`).join(' '), 'L 100,100 Z'].join(' ')
  return { line, area }
}, [activeMarketSeries])

const usersPageSize = 7
const filteredUsers = useMemo(() => {
  const term = usersSearch.trim().toLowerCase()
  return USERS_DATA.filter((user) => {
    const matchQuick =
      userSegment === 'All Users' ||
      (userSegment === 'Staffs' && ['Admin', 'Editor', 'Agent'].includes(user.role)) ||
      (userSegment === 'End-users' && user.role === 'End-user')

    const matchTerm =
      term.length === 0 ||
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phone.toLowerCase().includes(term)

    const matchRole = usersRoleFilter === 'All' || user.role === usersRoleFilter
    const matchStatus = usersStatusFilter === 'All' || user.status === usersStatusFilter

    const userDate = new Date(user.joined)
    const matchDate = usersDateFilter ? userDate >= new Date(usersDateFilter) : true

    return matchQuick && matchTerm && matchRole && matchStatus && matchDate
  })
}, [usersSearch, usersRoleFilter, usersStatusFilter, usersDateFilter, userSegment])

const totalUsersPages = Math.max(1, Math.ceil(filteredUsers.length / usersPageSize))
const paginatedUsers = useMemo(() => {
  const start = (usersPage - 1) * usersPageSize
  return filteredUsers.slice(start, start + usersPageSize)
}, [filteredUsers, usersPage])

const usersPageNumbers = Array.from({ length: totalUsersPages }, (_, index) => index + 1)
const usersRangeStart = filteredUsers.length === 0 ? 0 : (usersPage - 1) * usersPageSize + 1
const usersRangeEnd = (usersPage - 1) * usersPageSize + paginatedUsers.length
const isAllUsersSelected =
  paginatedUsers.length > 0 && paginatedUsers.every((user) => selectedUsers.includes(user.id))
const bulkUsersDisabled = selectedUsers.length === 0

const analyticsSpark = (points) => {
  if (!points || points.length === 0) return ''
  const max = Math.max(...points)
  const min = Math.min(...points)
  const span = max - min || 1
  return points
    .map((value, index) => {
      const x = points.length === 1 ? 100 : (index / (points.length - 1)) * 100
      const y = 100 - ((value - min) / span) * 70 - 15
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

  useEffect(() => {
  setCurrentPage(1)
  setSelectedNews((prev) => prev.filter((id) => filteredNews.some((item) => item.id === id)))
}, [searchTerm, selectedCategory, selectedStatus, dateFrom, dateTo, filteredNews])

useEffect(() => {
  setListingPage(1)
  setSelectedListings((prev) => prev.filter((id) => filteredListings.some((item) => item.id === id)))
}, [listingSearch, listingCategoryFilter, listingStatusFilter, listingLocationFilter, listingDateFilter, filteredListings])

useEffect(() => {
  setUsersPage(1)
  setSelectedUsers((prev) => prev.filter((id) => filteredUsers.some((user) => user.id === id)))
}, [usersSearch, usersRoleFilter, usersStatusFilter, usersDateFilter, filteredUsers])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

const toggleSelectAll = () => {
  if (isAllSelected) {
    setSelectedNews((prev) => prev.filter((id) => !paginatedNews.some((item) => item.id === id)))
    } else {
    setSelectedNews((prev) => [
      ...prev,
      ...paginatedNews.map((item) => item.id).filter((id) => !prev.includes(id)),
    ])
  }
}

const toggleSelectRow = (id) => {
  setSelectedNews((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
}

const toggleSelectAllUsers = () => {
  if (isAllUsersSelected) {
    setSelectedUsers((prev) => prev.filter((id) => !paginatedUsers.some((user) => user.id === id)))
  } else {
    setSelectedUsers((prev) => [
      ...prev,
      ...paginatedUsers.map((user) => user.id).filter((id) => !prev.includes(id)),
    ])
  }
}

const toggleSelectUser = (id) => {
  setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
}

const toggleSelectAllListings = () => {
  if (isAllListingsSelected) {
    setSelectedListings((prev) => prev.filter((id) => !paginatedListings.some((item) => item.id === id)))
  } else {
    setSelectedListings((prev) => [
      ...prev,
      ...paginatedListings.map((listing) => listing.id).filter((id) => !prev.includes(id)),
    ])
  }
}

const toggleSelectListing = (id) => {
  setSelectedListings((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

const openCreateListingModal = () => {
  setListingModalMode('create')
  setListingForm({ ...LISTING_FORM_STATE })
  setListingImages([])
  setListingFeatureSelections([])
  setListingModalOpen(true)
}

const openEditListingModal = (listing) => {
  setListingModalMode('edit')
  setListingForm({
    title: listing.title,
    category: listing.category,
    price: listing.price,
    address: listing.address,
    description: `Detail summary for ${listing.title}. Use this field to showcase nearby amenities, transport options, and unique selling points.`,
    status: listing.status,
    features: listing.features,
    location: listing.location.split(' · ')[0] || 'Seoul',
  })
  setListingImages(listing.gallery || [])
  setListingFeatureSelections(listing.features || [])
  setListingModalOpen(true)
}

const closeListingModal = () => {
  listingImages.forEach((image) => {
    if (image.startsWith('blob:')) {
      URL.revokeObjectURL(image)
    }
  })
  setListingImages([])
  setListingFeatureSelections([])
  setListingForm({ ...LISTING_FORM_STATE })
  setListingModalOpen(false)
}

const handleListingImageUpload = (event) => {
  const files = Array.from(event.target.files || [])
  if (files.length === 0) return

  const previews = files.map((file) => URL.createObjectURL(file))
  setListingImages((prev) => [...prev, ...previews])
}

const handleRemoveListingImage = (image) => {
  if (image.startsWith('blob:')) {
    URL.revokeObjectURL(image)
  }
  setListingImages((prev) => prev.filter((item) => item !== image))
}

const handleFeatureToggle = (feature) => {
  setListingFeatureSelections((prev) => {
    const next = prev.includes(feature)
      ? prev.filter((item) => item !== feature)
      : [...prev, feature]
    setListingForm((form) => ({ ...form, features: next }))
    return next
  })
}

const handleListingDeleteRequest = (listing) => {
  setListingToDelete(listing)
  setListingDeleteOpen(true)
}

const handleListingDeleteConfirm = () => {
  setListingDeleteOpen(false)
  setListingToDelete(null)
}

const handleListingDeleteCancel = () => {
  setListingDeleteOpen(false)
  setListingToDelete(null)
}

const openCreateUserModal = () => {
  setUsersModalMode('create')
  setUserForm({
    name: '',
    email: '',
    phone: '',
    role: 'Agent',
    status: 'Active',
    password: '',
  })
  setUsersModalOpen(true)
}

const openEditUserModal = (user) => {
  setUsersModalMode('edit')
  setUserForm({
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    password: '',
  })
  setUsersModalOpen(true)
}

const closeUsersModal = () => {
  setUsersModalOpen(false)
}

const handleUserDeleteRequest = (user) => {
  setUserToDelete(user)
  setUserDeleteOpen(true)
}

const handleUserDeleteConfirm = () => {
  setUserDeleteOpen(false)
  setUserToDelete(null)
}

const handleUserDeleteCancel = () => {
  setUserDeleteOpen(false)
  setUserToDelete(null)
}

const openCreateModal = () => {
  setModalMode('create')
  setModalForm(EMPTY_FORM_STATE)
  setThumbnailPreview('')
  setIsModalOpen(true)
}

const openEditModal = (news) => {
  setModalMode('edit')
  setModalForm({
    title: news.title,
    category: news.category,
    description: `Placeholder description for "${news.title}". Use this space to outline the key market insights, add supporting data, and include quotes from stakeholders.`,
    status: news.status,
    thumbnail: news.thumbnail,
  })
  setThumbnailPreview(news.thumbnail)
  setIsModalOpen(true)
}

const closeModal = () => {
  setIsModalOpen(false)
}

const handleThumbnailUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  const previewUrl = URL.createObjectURL(file)
  setThumbnailPreview(previewUrl)
  setModalForm((prev) => ({ ...prev, thumbnail: file.name }))
}

const handleDeleteRequest = (news) => {
  setNewsToDelete(news)
  setIsDeleteOpen(true)
}

const handleDeleteConfirm = () => {
  setIsDeleteOpen(false)
  setNewsToDelete(null)
}

const handleDeleteCancel = () => {
  setIsDeleteOpen(false)
  setNewsToDelete(null)
}

const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

const isDashboardView = activeNav === 'Dashboard Overview'
const isListingsView = activeNav === 'Real Estate Listings'
const isNewsView = activeNav === 'News Management'
const isMarketView = activeNav === 'Market Insights'
const isUserView = activeNav === 'Users Management'
const headerPrefix = isDashboardView
  ? 'Admin · Home'
  : isMarketView
    ? 'Admin · Market'
  : isListingsView
    ? 'Admin · Listings'
    : activeNav === 'Analytics'
      ? 'Admin · Analytics'
      : isUserView
        ? 'Admin · Users'
    : isNewsView
      ? 'Admin · Newsroom'
      : `Admin · ${activeNav}`
const searchPlaceholder = isDashboardView
  ? 'Search dashboard insights...'
  : isMarketView
    ? 'Search market analytics...'
  : isListingsView
    ? 'Search listings inventory...'
    : activeNav === 'Analytics'
      ? 'Search analytics insights...'
      : isUserView
        ? 'Search users...'
    : isNewsView
      ? 'Quick search the newsroom...'
      : 'Search admin console...'

  return (
  <div className="min-h-screen bg-slate-50 font-['Inter',_'Noto_Sans',_sans-serif] text-slate-900">
      <aside
        className={classNames(
        'fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-out',
          'shadow-xl shadow-slate-900/10'
        )}
      style={{ width: collapsed ? '84px' : '268px' }}
      >
        <div className="flex items-center justify-between px-4 pt-6">
          <div
            className={classNames(
            'flex items-center gap-3 font-semibold tracking-tight text-indigo-600',
              collapsed && 'justify-center text-base'
            )}
          >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              T
            </span>
            {!collapsed && (
              <div>
              <div className="text-base font-bold text-slate-900">TOFU 01</div>
              <div className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                Admin Panel
                </div>
              </div>
            )}
          </div>
        </div>

      <SidebarNav collapsed={collapsed} activeItem={activeNav} onSelect={setActiveNav} />
        <SidebarFooter collapsed={collapsed} />
      </aside>

      <main
        className="flex min-h-screen flex-col"
      style={{ marginLeft: collapsed ? '84px' : '268px' }}
      >
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCollapsed((prev) => !prev)}
              className="rounded-2xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
                aria-label="Toggle sidebar"
              >
                <svg
                  className={classNames('h-5 w-5 transition-transform', collapsed && 'rotate-180')}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  {headerPrefix}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">Dashboard</span>
                  <span>/</span>
                  <span>{activeNav}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  className="h-11 w-72 rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            <select
              value={interfaceLanguage}
              onChange={(event) => setInterfaceLanguage(event.target.value)}
              className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC] md:inline-flex"
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:text-indigo-600">
                <span className="text-lg">🔔</span>
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                3
                </span>
              </button>
            <button
              onClick={() => navigate('/')}
              className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-[#0075C9]/40 hover:text-[#0075C9] md:inline-flex"
            >
              Go to customer view
            </button>
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                  {adminInitials}
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-semibold text-slate-900">{adminName}</p>
                <p className="text-xs text-slate-400">{adminEmail}</p>
                </div>
                <button
                  onClick={handleLogout}
                className="ml-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
      </header>

      {isDashboardView ? (
        <section className="flex-1 bg-slate-50 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
              {DASHBOARD_KPIS.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-lg shadow-slate-900/5 transition hover:shadow-xl hover:shadow-slate-900/10 lg:col-span-4 xl:col-span-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {card.label}
                      </p>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">{card.value}</p>
                    </div>
                    <span
                      className={classNames(
                        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                        card.tone === 'up'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      )}
                    >
                      {card.delta}
                </span>
              </div>
                  <p className="mt-4 text-xs text-slate-500">{card.description}</p>
                  <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={classNames(
                        'h-full rounded-full',
                        card.tone === 'up' ? 'bg-[#0075C9]' : 'bg-rose-500'
                      )}
                      style={{ width: card.tone === 'up' ? '78%' : '38%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="space-y-6 xl:col-span-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          Property listings by month
                        </h3>
                        <p className="text-xs text-slate-500">KR / MM / EN sources (rolling 12 months)</p>
                      </div>
                      <button className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500 hover:border-[#0075C9]/40 hover:text-[#0075C9]">
                        Export
                      </button>
                    </div>
                    <div className="relative mt-6 h-64 overflow-hidden rounded-2xl bg-slate-50">
                      <div className="absolute inset-0 grid grid-cols-12 gap-3 px-6 py-6">
                        {[...Array(12)].map((_, idx) => (
                          <span key={idx} className="flex h-full w-full items-end justify-center">
                            <span className="w-3 rounded-full bg-gradient-to-t from-[#0075C9]/20 via-[#0075C9]/35 to-transparent" />
                </span>
                        ))}
                      </div>
                      <svg viewBox="0 0 320 160" className="absolute inset-6 h-[calc(100%-48px)] w-[calc(100%-48px)]">
                        <path
                          d="M0 120 C40 90, 80 140, 120 100 S200 70, 240 90 280 140, 320 110"
                          fill="none"
                          stroke="#0075C9"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M0 130 L0 160 L320 160 L320 120 Z"
                          fill="url(#gradientFill)"
                          opacity="0.35"
                        />
                        <defs>
                          <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0075C9" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#0075C9" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">Article views by category</h3>
                        <p className="text-xs text-slate-500">Last 14 days · KR/MM/EN</p>
                      </div>
                      <div className="rounded-full bg-[#E2E8F0] px-3 py-1 text-xs font-semibold text-slate-600">
                        Auto-sync
                      </div>
                    </div>
                    <div className="mt-6 flex h-64 flex-col justify-end gap-3">
                      {['Real Estate', 'Business', 'Policy', 'Lifestyle', 'Tech'].map((label, idx) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="w-24 text-xs font-semibold text-slate-500">{label}</span>
                          <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={classNames(
                                'absolute inset-y-0 left-0 rounded-full',
                                idx % 2 === 0 ? 'bg-[#0075C9]' : 'bg-[#006CA6]'
                              )}
                              style={{ width: `${70 - idx * 8}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">{18 - idx * 3}k</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">Popular regions heatmap</h3>
                        <p className="text-xs text-slate-500">Live search + listing interactions</p>
                      </div>
                      <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:border-[#0075C9]/40 hover:text-[#0075C9]">
                        Explore
                </button>
              </div>
                    <div className="mt-6 h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0075C9]/10 via-slate-100 to-[#006CA6]/10">
                      <div className="relative h-full w-full">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,117,201,0.45)_0,transparent_55%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_55%,rgba(22,163,74,0.35)_0,transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(220,38,38,0.35)_0,transparent_45%)]" />
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500 shadow">
                          Heat overlay • Seoul, Busan, Yangon
            </div>
          </div>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-slate-900">Review queue</h3>
                      <span className="rounded-full bg-[#E2E8F0] px-3 py-1 text-xs font-semibold text-slate-600">
                        {REVIEW_QUEUE.length} pending
                      </span>
                    </div>
                    <ul className="mt-6 space-y-4 text-sm text-slate-600">
                      {REVIEW_QUEUE.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-start justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                            <p className="text-xs text-slate-500">
                              {item.type} · {item.owner}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-slate-500">{item.submitted}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-6 xl:col-span-4">
                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900">Recent activity</h3>
                    <button className="text-xs font-semibold text-[#0075C9] hover:underline">View all</button>
                  </div>
                  <ul className="mt-5 space-y-4 text-sm text-slate-600">
                    {RECENT_ACTIVITY.map((entry) => (
                      <li key={entry.id} className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E2E8F0] text-lg">
                          {entry.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                              {entry.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {entry.author} • {entry.time}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900">Setup checklist</h3>
                    <span className="text-xs font-semibold text-slate-500">
                      {DASHBOARD_CHECKLIST.length} tasks
                    </span>
                  </div>
                  <ul className="mt-5 space-y-4 text-sm text-slate-600">
                    {DASHBOARD_CHECKLIST.map((item) => (
                      <li
                        key={item.id}
                        className="flex flex-col gap-2 rounded-2xl border border-dashed border-[#0075C9]/30 bg-[#0075C9]/5 px-4 py-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                          <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                        </div>
                        <p className="text-xs text-slate-500">{item.description}</p>
                        <button className="self-start rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0075C9] shadow hover:bg-slate-50">
                          {item.cta}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">Latest news</h3>
                  <button className="text-xs font-semibold text-[#0075C9] hover:underline">Manage newsroom</button>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                      {LATEST_NEWS.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900">{item.title}</td>
                          <td className="px-4 py-3">{item.category}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{item.updated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">Latest listings</h3>
                  <button className="text-xs font-semibold text-[#0075C9] hover:underline">View all listings</button>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Listing</th>
                        <th className="px-4 py-3 text-left">Location</th>
                        <th className="px-4 py-3 text-left">Price</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                      {LATEST_LISTINGS.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900">{item.name}</td>
                          <td className="px-4 py-3">{item.location}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">{item.price}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={item.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : isMarketView ? (
        <section className="flex-1 bg-slate-50 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-lg shadow-slate-900/5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">💹 Market Insights</h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Track pricing trends, demand signals, and high-performing regions across KR / MM / EN markets.
                  </p>
              </div>
                <div className="flex items-center gap-3">
                  <select
                    value={marketDateRange}
                    onChange={(event) => setMarketDateRange(event.target.value)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC] focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
                  >
                    {MARKET_DATE_OPTIONS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {MARKET_KPIS.map((card) => {
                  const sparkMax = Math.max(...card.spark)
                  const sparkMin = Math.min(...card.spark)
                  const sparkSpan = sparkMax - sparkMin || 1
                  const sparkPath = card.spark
                    .map((value, index) => {
                      const x =
                        card.spark.length === 1
                          ? 100
                          : (index / (card.spark.length - 1)) * 100
                      const y = 100 - ((value - sparkMin) / sparkSpan) * 70 - 15
                      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`
                    })
                    .join(' ')

                  return (
                    <div
                      key={card.label}
                      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#5D45DC]/10"
                >
                  <div className="flex items-start justify-between">
                    <div>
                          <span className="text-xl">{card.icon}</span>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {card.label}
                      </p>
                          <p className="mt-3 text-2xl font-semibold text-slate-900">{card.value}</p>
                    </div>
                    <span
                      className={classNames(
                        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                            card.tone === 'up'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      )}
                    >
                      {card.delta}
                    </span>
                  </div>
                      <div className="mt-6 h-16 w-full">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full text-[#5D45DC]">
                          <path
                            d={sparkPath}
                            fill="none"
                            stroke="url(#spark-gradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient id="spark-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#5D45DC" />
                              <stop offset="100%" stopColor="#AE9FFF" />
                            </linearGradient>
                          </defs>
                        </svg>
              </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Property Price Trends</h2>
                  <p className="text-xs text-slate-500">Comparative trends for primary asset categories</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-500">
                  {Object.keys(MARKET_PRICE_SERIES).map((category) => (
                    <button
                      key={category}
                      onClick={() => setMarketCategory(category)}
                      className={classNames(
                        'rounded-full px-4 py-1.5 transition',
                        marketCategory === category
                          ? 'bg-white text-[#5D45DC] shadow'
                          : 'hover:text-[#5D45DC]'
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative mt-6 h-80 overflow-hidden rounded-3xl bg-gradient-to-br from-[#5D45DC]/5 to-[#AE9FFF]/10">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-6 h-[calc(100%-48px)] w-[calc(100%-48px)] text-[#5D45DC]">
                  <path d={marketChartPaths.area} fill="url(#market-area)" opacity="0.4" />
                  <path
                    d={marketChartPaths.line}
                    fill="none"
                    stroke="url(#market-line)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="market-line" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#5D45DC" />
                      <stop offset="100%" stopColor="#AE9FFF" />
                    </linearGradient>
                    <linearGradient id="market-area" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#5D45DC" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#5D45DC" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute bottom-4 left-6 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500 shadow">
                  {marketCategory} · {marketDateRange}
                  </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5 xl:col-span-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Regional performance map</h2>
                  <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                    View heatmap
                  </button>
                </div>
                <div className="mt-6 h-[360px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#5D45DC]/15 via-slate-100 to-[#AE9FFF]/15">
                  <div className="relative h-full w-full">
                    {MARKET_REGIONS.map((region, index) => (
                      <div
                        key={region.id}
                        className="absolute flex flex-col items-center gap-1 rounded-full bg-white/85 px-3 py-2 text-xs font-semibold text-[#5D45DC] shadow-md shadow-[#5D45DC]/20 transition hover:-translate-y-0.5"
                        style={{
                          top: `${20 + (index * 13) % 60}%`,
                          left: `${22 + (index * 17) % 55}%`,
                        }}
                      >
                        <span className="text-lg leading-none">📍</span>
                        <span>{region.name.split(' · ')[0]}</span>
                        <span className="text-[10px] text-slate-500">{region.growth}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5 xl:col-span-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Top regions</h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {MARKET_REGIONS.length} markets
                  </span>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Region</th>
                        <th className="px-4 py-3 text-left">Avg. Price</th>
                        <th className="px-4 py-3 text-left">Monthly Growth</th>
                        <th className="px-4 py-3 text-left">Demand</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                      {MARKET_REGIONS.map((region) => (
                        <tr key={region.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900">{region.name}</td>
                          <td className="px-4 py-3">{region.avgPrice}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                              {region.growth}
                            </span>
                          </td>
                          <td className="px-4 py-3">{region.demand}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-6 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5 lg:col-span-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">Analytics</h2>
                  <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-500">
                    {MARKET_TABS.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setMarketTab(tab.key)}
                        className={classNames(
                          'rounded-full px-4 py-1.5 transition',
                          marketTab === tab.key
                            ? 'bg-white text-[#5D45DC] shadow'
                            : 'hover:text-[#5D45DC]'
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-[#f7f6ff] to-white px-6 py-6 text-sm text-slate-600 shadow-inner shadow-[#5D45DC]/10">
                  {marketTab === 'demand' && (
                    <div className="flex h-64 items-end gap-4">
                      {[48, 52, 58, 62, 68, 74, 79].map((value, index) => (
                        <div key={index} className="flex flex-1 flex-col items-center gap-2">
                          <div
                            className="w-8 rounded-t-full bg-gradient-to-t from-[#5D45DC] to-[#AE9FFF]"
                            style={{ height: `${value}%` }}
                          />
                          <span className="text-xs text-slate-500">W{index + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {marketTab === 'sellingTime' && (
                    <div className="relative h-64">
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-[#5D45DC]">
                        <path
                          d="M0,70 L15,65 L30,68 L45,58 L60,52 L75,48 L90,42 L100,45"
                          fill="none"
                          stroke="url(#selling-time-line)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <defs>
                          <linearGradient id="selling-time-line" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#5D45DC" />
                            <stop offset="100%" stopColor="#AE9FFF" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute bottom-4 left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500 shadow">
                        Median time to sell: 32 days
                      </div>
                    </div>
                  )}
                  {marketTab === 'roi' && (
                    <div className="flex h-64 items-center justify-center">
                      <div className="relative h-44 w-44 rounded-full bg-[#5D45DC]/10">
                        <div className="absolute inset-0 animate-spin rounded-full border-[12px] border-[#AE9FFF]/50 border-t-[#5D45DC]" />
                        <div className="absolute inset-4 rounded-full bg-white shadow-inner shadow-slate-900/10" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">ROI</p>
                          <p className="mt-1 text-2xl font-semibold text-[#5D45DC]">12.4%</p>
                          <p className="mt-1 text-[11px] text-slate-400">Avg. portfolio return</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5 lg:col-span-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Market news feed</h2>
                  <button className="text-xs font-semibold text-[#5D45DC] hover:underline">View all</button>
                </div>
                <div className="mt-5 space-y-4 text-sm text-slate-600">
                  {MARKET_NEWS.map((item) => (
                    <div key={item.id} className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                        <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-400">
                          {item.category} · {new Date(item.publishedAt).toLocaleDateString()}
                        </p>
                        <button className="text-xs font-semibold text-[#5D45DC] hover:underline">View more</button>
                  </div>
                    </div>
                  ))}
                  {MARKET_NEWS.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                      Tag articles as “Market” or “Economy” to surface them here automatically.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-md shadow-slate-900/5 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-slate-500">
                Share insights with finance, strategy, and content teams in one click.
              </span>
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-slate-600 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                  📊 Export to Excel
                    </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-slate-600 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                  📄 Download Report (PDF)
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-[#5D45DC] px-4 py-2 text-white shadow transition hover:bg-[#4B36B6]">
                  🔗 Share Dashboard
                    </button>
                  </div>
                </div>
                      </div>
        </section>
      ) : activeNav === 'Analytics' ? (
        <section className="flex-1 bg-slate-50 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-lg shadow-slate-900/5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">📊 Analytics</h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Monitor platform growth, user engagement, and listing performance across the region.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-semibold">
                  {ANALYTICS_DATE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => setAnalyticsDateRange(option)}
                      className={classNames(
                        'rounded-full px-4 py-1 transition',
                        analyticsDateRange === option
                          ? 'bg-white text-[#5D45DC] shadow'
                          : 'text-slate-500 hover:text-[#5D45DC]'
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {ANALYTICS_KPIS.map((card) => (
                  <div
                    key={card.label}
                    className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#5D45DC]/10"
                >
                  <div className="flex items-start justify-between">
                    <div>
                        <span className="text-xl">{card.icon}</span>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {card.label}
                      </p>
                        <p className="mt-3 text-2xl font-semibold text-slate-900">{card.value}</p>
                    </div>
                    <span
                      className={classNames(
                        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                          card.tone === 'up'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      )}
                    >
                      {card.delta}
                    </span>
                  </div>
                    <div className="mt-6 h-16 w-full">
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full text-[#5D45DC]">
                        <path
                          d={analyticsSpark(card.spark)}
                          fill="none"
                          stroke="url(#analytics-spark)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <defs>
                          <linearGradient id="analytics-spark" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#5D45DC" />
                            <stop offset="100%" stopColor="#AE9FFF" />
                          </linearGradient>
                        </defs>
                      </svg>
                        </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="space-y-6 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5 xl:col-span-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">Engagement overview</h2>
                  <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-500">
                    {[
                      { key: 'userActivity', label: 'User Activity' },
                      { key: 'listingsPerformance', label: 'Listings Performance' },
                      { key: 'topAgents', label: 'Top Contributors' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setAnalyticsTab(tab.key)}
                      className={classNames(
                          'rounded-full px-4 py-1.5 transition',
                          analyticsTab === tab.key
                            ? 'bg-white text-[#5D45DC] shadow'
                            : 'hover:text-[#5D45DC]'
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-[#f7f6ff] to-white px-6 py-6 text-sm text-slate-600 shadow-inner shadow-[#5D45DC]/10">
                  {analyticsTab === 'userActivity' && (
                    <div className="relative h-72">
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-[#5D45DC]">
                        <path
                          d="M0,80 L10,78 L20,74 L30,68 L40,62 L50,55 L60,49 L70,44 L80,40 L90,38 L100,37"
                          fill="none"
                          stroke="url(#analytics-line)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <defs>
                          <linearGradient id="analytics-line" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#5D45DC" />
                            <stop offset="100%" stopColor="#AE9FFF" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute bottom-4 left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500 shadow">
                        Weekly active users · {analyticsDateRange}
                  </div>
                    </div>
                  )}
                  {analyticsTab === 'listingsPerformance' && (
                    <div className="flex h-72 items-end gap-3">
                      {['Views', 'Inquiries', 'Favorites', 'Shares'].map((label, index) => (
                        <div key={label} className="flex flex-1 flex-col items-center gap-2">
                          <div
                            className="relative flex w-10 items-center justify-center rounded-t-full bg-gradient-to-t from-[#5D45DC] to-[#AE9FFF]"
                            style={{ height: `${40 + index * 15}%` }}
                          >
                            <span className="absolute -top-8 flex h-8 items-center rounded-full bg-white px-2 text-xs font-semibold text-[#5D45DC] shadow">
                              {label === 'Views' && '48K'}
                              {label === 'Inquiries' && '12K'}
                              {label === 'Favorites' && '8.5K'}
                              {label === 'Shares' && '4.2K'}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-slate-500">{label}</span>
                </div>
              ))}
                    </div>
                  )}
                  {analyticsTab === 'topAgents' && (
                    <div className="space-y-4">
                      {ANALYTICS_AGENTS.map((agent) => (
                        <div
                          key={agent.id}
                          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
                            <p className="text-xs text-slate-500">
                              {agent.listings} listings · {agent.inquiries} inquiries
                        </p>
                      </div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <span className="rounded-full bg-white px-3 py-1 text-[#5D45DC] shadow">
                              Score {agent.score}
                            </span>
                            <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                              View profile
                            </button>
                      </div>
                    </div>
                  ))}
                </div>
                  )}
                </div>
              </div>
              <div className="space-y-6 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5 xl:col-span-4">
                  <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Platform highlights</h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Last 30 days
                    </span>
                  </div>
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-[#5D45DC]/10 to-[#AE9FFF]/10 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">Leads up 12%</p>
                    <p className="text-xs text-slate-500">
                      Driven by Seoul and Yangon campaigns with increased ad spend.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-[#5D45DC]/10 to-[#AE9FFF]/10 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">Agent response time</p>
                    <p className="text-xs text-slate-500">
                      Average response time dropped below 3 hours across verified agents.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">New listing milestones</p>
                    <p className="text-xs text-slate-500">
                      32 premium projects launched in the last 4 weeks with KR/MM bilingual assets.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                  <h2 className="text-lg font-semibold text-slate-900">Listings performance</h2>
                  <p className="text-xs text-slate-500">Top-performing inventory by engagement</p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                    Export CSV
                  </button>
                  <button className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                    Download PDF Report
                  </button>
                  <button className="rounded-full bg-[#5D45DC] px-4 py-2 text-white shadow transition hover:bg-[#4B36B6]">
                    Share Dashboard
                      </button>
                    </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 text-left">Listing</th>
                      <th className="px-4 py-3 text-left">Views</th>
                      <th className="px-4 py-3 text-left">Inquiries</th>
                      <th className="px-4 py-3 text-left">Avg. Time</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                    {ANALYTICS_LISTINGS.map((listing) => (
                      <tr key={listing.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">{listing.name}</td>
                        <td className="px-4 py-3">{listing.views}</td>
                        <td className="px-4 py-3">{listing.inquiries}</td>
                        <td className="px-4 py-3">{listing.timeOn}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={listing.status} />
                        </td>
                        <td className="px-4 py-3 text-right text-xs font-semibold">
                          <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                            View
                          </button>
                          <button className="ml-2 rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      ) : isUserView ? (
        <section className="flex-1 bg-slate-50 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8">
            <div className="rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-lg shadow-slate-900/5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">👤 User Management</h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Manage staff and end-user accounts, roles, and platform access in one place.
                    </p>
                  </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={openCreateUserModal}
                    className="inline-flex items-center gap-2 rounded-full bg-[#5D45DC] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#5D45DC]/30 transition hover:bg-[#4B36B6]"
                  >
                    <span className="text-lg leading-none">＋</span>
                    Add User
                    </button>
                  <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                    ⬇ Export CSV
                    </button>
                  </div>
                </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                {USER_SEGMENTS.map((segment) => (
                  <button
                    key={segment}
                    onClick={() => setUserSegment(segment)}
                    className={classNames(
                      'rounded-full border px-4 py-2 transition',
                      userSegment === segment
                        ? 'border-[#5D45DC]/40 bg-[#5D45DC]/10 text-[#5D45DC] shadow-inner'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-[#5D45DC]/30 hover:text-[#5D45DC]'
                    )}
                  >
                    {segment}
                  </button>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 shadow-inner">
                  <span className="text-slate-400">🔍</span>
                  <input
                    value={usersSearch}
                    onChange={(event) => setUsersSearch(event.target.value)}
                    placeholder="Search by name, email, phone..."
                    className="w-full border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                  />
                </div>
                <select
                  value={usersRoleFilter}
                  onChange={(event) => setUsersRoleFilter(event.target.value)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
                >
                  {USERS_ROLES.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <select
                  value={usersStatusFilter}
                  onChange={(event) => setUsersStatusFilter(event.target.value)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
                >
                  {USERS_STATUS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={usersDateFilter}
                  onChange={(event) => setUsersDateFilter(event.target.value)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                    Total users: {USERS_DATA.length}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                    Filters: {userSegment}, {usersRoleFilter}, {usersStatusFilter}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: 'Activate', action: () => null },
                    { label: 'Deactivate', action: () => null },
                    { label: 'Assign role', action: () => null },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      disabled={bulkUsersDisabled}
                      className={classNames(
                        'rounded-full border px-3 py-1 transition',
                        bulkUsersDisabled
                          ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-[#5D45DC]/40 hover:text-[#5D45DC]'
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              {selectedUsers.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <span>
                    <strong className="font-semibold text-slate-900">{selectedUsers.length}</strong> users selected
                        </span>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                      Activate
                    </button>
                    <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                      Deactivate
                    </button>
                    <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                      Assign role
                    </button>
                    <button
                      onClick={() => setSelectedUsers([])}
                      className="rounded-full px-3 py-1 text-slate-400 transition hover:text-slate-600"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
              <div className="overflow-hidden rounded-2xl border border-slate-100">
                <div className="max-h-[520px] overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-[#5D45DC] focus:ring-[#5D45DC]"
                          checked={isAllUsersSelected}
                          onChange={toggleSelectAllUsers}
                        />
                      </th>
                      <th className="px-4 py-3 text-left">User</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Role</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Date Joined</th>
                      <th className="px-4 py-3 text-left">Last Activity</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                    {paginatedUsers.map((user) => {
                      const isSelected = selectedUsers.includes(user.id)
                      return (
                        <tr
                          key={user.id}
                          className={classNames(
                            'transition hover:bg-slate-50',
                            isSelected && 'bg-[#E2E8F0]/70'
                          )}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-slate-300 text-[#5D45DC] focus:ring-[#5D45DC]"
                              checked={isSelected}
                              onChange={() => toggleSelectUser(user.id)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5D45DC]/10 text-sm font-semibold text-[#5D45DC]">
                                  {user.name
                                    .split(' ')
                                    .map((part) => part[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </div>
                              )}
                <div>
                                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                <p className="text-xs text-slate-400">{user.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-[#5D45DC]/10 px-3 py-1 text-xs font-semibold text-[#5D45DC]">
                              {user.role}
                        </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={classNames(
                                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                                user.status === 'Active' && 'bg-emerald-100 text-emerald-700',
                                user.status === 'Inactive' && 'bg-slate-100 text-slate-600',
                                user.status === 'Suspended' && 'bg-rose-100 text-rose-700'
                              )}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {new Date(user.joined).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-400">{user.lastLogin}</td>
                          <td className="px-4 py-3 text-right text-xs font-semibold">
                            <div className="flex flex-wrap items-center justify-end gap-2">
                              <button
                                onClick={() => openEditUserModal(user)}
                                className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]"
                              >
                                🖊️ Edit
                              </button>
                              <button
                                onClick={() => handleUserDeleteRequest(user)}
                                className="rounded-full border border-rose-200 px-3 py-1 text-rose-500 transition hover:border-rose-300 hover:bg-rose-50"
                              >
                                🗑️ Delete
                              </button>
                              <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                                🔑 Reset
                              </button>
                              <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                                👁️ View
                              </button>
                      </div>
                          </td>
                        </tr>
                      )
                    })}
                    {paginatedUsers.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-slate-500">
                            <span className="text-4xl">👥</span>
                            <p className="text-sm font-semibold">
                              No users match the current filters.
                            </p>
                            <p className="text-xs text-slate-400">
                              Adjust search keywords or reset filters to view all accounts.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                <div>
                  Showing{' '}
                  <span className="font-semibold text-slate-900">{paginatedUsers.length > 0 ? usersRangeStart : 0}</span>{' '}
                  –{' '}
                  <span className="font-semibold text-slate-900">{usersRangeEnd}</span> of{' '}
                  <span className="font-semibold text-slate-900">{filteredUsers.length}</span> users
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUsersPage((prev) => Math.max(1, prev - 1))}
                    className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-500 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={usersPage === 1}
                  >
                    Prev
                  </button>
                  <div className="flex items-center gap-1">
                    {usersPageNumbers.slice(0, 4).map((page) => (
                      <button
                        key={page}
                        onClick={() => setUsersPage(page)}
                        className={classNames(
                          'h-9 w-9 rounded-full text-sm font-semibold transition',
                          page === usersPage
                            ? 'bg-[#5D45DC] text-white shadow-md shadow-[#5D45DC]/40'
                            : 'border border-slate-200 text-slate-500 hover:border-[#5D45DC]/40 hover:text-[#5D45DC]'
                        )}
                      >
                        {page}
                  </button>
                    ))}
                    {totalUsersPages > 4 && <span className="px-1 text-xs text-slate-400">...</span>}
                </div>
                  <button
                    onClick={() => setUsersPage((prev) => Math.min(totalUsersPages, prev + 1))}
                    className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-500 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={usersPage === totalUsersPages}
                  >
                    Next
                  </button>
              </div>
              </div>
            </div>
          </div>
        </section>
      ) : activeNav === 'Settings' ? (
        <section className="flex-1 bg-slate-50 px-4 pb-28 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-lg shadow-slate-900/5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">⚙️ Settings</h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-500">
                  Manage platform preferences, branding, integrations, notifications, and security policies across the
                  TOFU real estate network.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setPendingChanges(false)}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]"
                >
                  Reset changes
                </button>
                <button
                  onClick={() => setPendingChanges(false)}
                  className={classNames(
                    'rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#5D45DC]/30 transition',
                    pendingChanges
                      ? 'bg-gradient-to-r from-[#5D45DC] to-[#AE9FFF] hover:from-[#4B36B6] hover:to-[#8E7CF8]'
                      : 'bg-slate-300 hover:bg-slate-400'
                  )}
                  disabled={!pendingChanges}
                >
                  Save changes
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-900/5 lg:max-w-xs">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sections</h2>
                <nav className="mt-4 flex flex-col gap-2 text-sm">
                  {SETTINGS_TABS.map((tab) => {
                    const active = settingsTab === tab.key
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setSettingsTab(tab.key)}
                        className={classNames(
                          'flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition',
                          active
                            ? 'border-[#5D45DC]/40 bg-[#5D45DC]/10 text-[#5D45DC] shadow-inner'
                            : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                        )}
                      >
                        <span className="text-lg">{tab.icon}</span>
                        <span className="font-semibold">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              <div className="flex-1 space-y-6">
                {settingsTab === 'general' && (
                  <div className="space-y-6 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">General settings</h3>
                      <p className="text-sm text-slate-500">
                        Configure the core platform information shown to customers and staff.
                      </p>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      {[
                        { label: 'Site name', key: 'siteName', placeholder: 'TOFU 01 Real Estate Portal' },
                        { label: 'Domain / Base URL', key: 'domain', placeholder: 'https://portal.tofu.com' },
                        { label: 'Contact email', key: 'contact', placeholder: 'support@tofu.com' },
                        { label: 'Timezone', key: 'timezone', type: 'select', options: ['Asia/Seoul', 'Asia/Yangon', 'UTC'] },
                        { label: 'Currency', key: 'currency', type: 'select', options: ['MMK', 'USD'] },
                        {
                          label: 'Date format',
                          key: 'dateFormat',
                          type: 'select',
                          options: ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'],
                        },
                        {
                          label: 'Time format',
                          key: 'timeFormat',
                          type: 'select',
                          options: ['24-hour', '12-hour'],
                        },
                      ].map((field) => (
                        <div key={field.key} className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {field.label}
                          </label>
                          {field.type === 'select' ? (
                            <select
                              onChange={() => setPendingChanges(true)}
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
                            >
                              {field.options.map((option) => (
                                <option key={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              onChange={() => setPendingChanges(true)}
                              placeholder={field.placeholder}
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setPendingChanges(false)}
                        className="rounded-full bg-[#5D45DC] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#5D45DC]/30 transition hover:bg-[#4B36B6]"
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                )}

                {settingsTab === 'branding' && (
                  <div className="grid gap-6 lg:grid-cols-[1.1fr,1.4fr]">
                    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#5D45DC]/10 via-white to-[#AE9FFF]/10 px-6 py-6 shadow-inner shadow-[#5D45DC]/10">
                      <h3 className="text-base font-semibold text-slate-900">Live preview</h3>
                      <p className="mt-2 text-sm text-slate-500">Preview how branding applies across the portal.</p>
                      <div className="mt-6 rounded-2xl border border-white/60 bg-white/90 p-6 shadow-lg shadow-[#5D45DC]/20">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-white"
                            style={{ background: brandPrimary }}
                          >
                            TO
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">TOFU Portal</p>
                            <p className="text-xs text-slate-500">Preview headline</p>
                          </div>
                        </div>
                        <div className="mt-6 rounded-xl border border-slate-200/70 bg-white px-4 py-5">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Buttons</p>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <button
                              className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow transition"
                              style={{ background: brandPrimary }}
                            >
                              Primary button
                            </button>
                            <button
                              className="rounded-full border px-4 py-2 text-sm font-semibold text-slate-600 transition"
                              style={{ borderColor: brandSecondary, color: brandSecondary }}
                            >
                              Secondary
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                      <h3 className="text-base font-semibold text-slate-900">Branding assets</h3>
                      <div className="grid gap-5 md:grid-cols-2">
                        {['Logo (light)', 'Logo (dark)', 'Favicon'].map((label) => (
                          <div key={label} className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              {label}
                            </label>
                            <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-500 transition hover:border-[#5D45DC]/40 hover:bg-[#5D45DC]/5">
                              <span className="text-2xl">📁</span>
                              <span>Upload {label.toLowerCase()}</span>
                              <input type="file" className="hidden" onChange={() => setPendingChanges(true)} />
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Primary color
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            {BRAND_COLORS.map((color) => (
                              <button
                                key={color}
                                onClick={() => {
                                  setBrandPrimary(color)
                                  setPendingChanges(true)
                                }}
                                className={classNames(
                                  'h-9 w-9 rounded-full border-2 transition',
                                  brandPrimary === color ? 'border-[#5D45DC]' : 'border-white shadow'
                                )}
                                style={{ background: color }}
                              />
                            ))}
                        </div>
                      </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Secondary color
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            {BRAND_SECONDARY.map((color) => (
                              <button
                                key={color}
                                onClick={() => {
                                  setBrandSecondary(color)
                                  setPendingChanges(true)
                                }}
                                className={classNames(
                                  'h-9 w-9 rounded-full border-2 transition',
                                  brandSecondary === color ? 'border-[#5D45DC]' : 'border-white shadow'
                                )}
                                style={{ background: color }}
                              />
                            ))}
                    </div>
                        </div>
                      </div>
                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Typography
                          </label>
                          <select
                            value={brandFont}
                            onChange={(event) => {
                              setBrandFont(event.target.value)
                              setPendingChanges(true)
                            }}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
                          >
                            {BRAND_FONTS.map((font) => (
                              <option key={font}>{font}</option>
                            ))}
                          </select>
                </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Theme mode
                          </label>
                          <div className="inline-grid grid-cols-3 overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold">
                            {['Light', 'Dark', 'Auto'].map((mode) => (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => {
                                  setThemeMode(mode)
                                  setPendingChanges(true)
                                }}
                                className={classNames(
                                  'px-4 py-1.5 transition',
                                  themeMode === mode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                )}
                              >
                                {mode}
                              </button>
                            ))}
                </div>
              </div>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'content' && (
                  <div className="space-y-6">
                    {[
                      {
                        title: 'News categories',
                        description: 'Organize newsroom taxonomy across languages.',
                        items: ['Market', 'Economy', 'Policy', 'Investment'],
                      },
                      {
                        title: 'Property types',
                        description: 'Control the property categories agents can select.',
                        items: ['Apartment', 'Condo', 'House', 'Land', 'Commercial'],
                      },
                      {
                        title: 'Amenities',
                        description: 'Set the features available for listings.',
                        items: ['Balcony', 'Parking', 'Smart Lock', '24/7 Security'],
                      },
                    ].map((card) => (
                      <div
                        key={card.title}
                        className="space-y-4 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5"
                      >
                  <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
                            <p className="text-sm text-slate-500">{card.description}</p>
                          </div>
                          <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                            ＋ Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {card.items.map((item) => (
                            <span
                              key={item}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                            >
                              {item}
                              <button
                                onClick={() => setPendingChanges(true)}
                                className="text-slate-400 hover:text-rose-500"
                              >
                                ✕
                              </button>
                    </span>
                          ))}
                  </div>
                      </div>
                    ))}
                  </div>
                )}

                {settingsTab === 'integrations' && (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {[
                      { label: 'Google Maps', icon: '🗺️', status: 'Connected', description: 'Map tiles & geocoding' },
                      { label: 'Weather API', icon: '🌤️', status: 'Not connected', description: 'Regional weather data' },
                      { label: 'Google Analytics (GA4)', icon: '📊', status: 'Connected', description: 'Traffic insights' },
                      { label: 'Stock Data', icon: '📈', status: 'Connected', description: 'Market indices' },
                      { label: 'Webhook endpoints', icon: '🔁', status: 'Connected', description: 'CRM + Slack' },
                    ].map((integration) => (
                      <div
                        key={integration.label}
                        className="space-y-4 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              <span className="mr-2 text-lg">{integration.icon}</span>
                              {integration.label}
                            </p>
                            <p className="text-xs text-slate-500">{integration.description}</p>
                          </div>
                          <span
                            className={classNames(
                              'rounded-full px-3 py-1 text-xs font-semibold',
                              integration.status === 'Connected'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-500'
                            )}
                          >
                            {integration.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            API key / endpoint
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-500 focus:border-[#5D45DC] focus:outline-none focus:ring-2 focus:ring-[#5D45DC]/15"
                              placeholder="••••••••••••••••••••"
                              onChange={() => setPendingChanges(true)}
                            />
                            <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                              Test
                      </button>
                    </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <button className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                            Rotate key
                          </button>
                          <button className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-rose-300 hover:text-rose-500">
                            Disconnect
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {settingsTab === 'localization' && (
                  <div className="space-y-4 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">Localization preferences</h3>
                      <p className="text-sm text-slate-500">
                        Configure language availability, number formatting, and regional defaults.
                      </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Available languages
                        </label>
                        <div className="grid gap-2">
                          {[
                            { label: 'English', enabled: true },
                            { label: 'Korean', enabled: true },
                            { label: 'Burmese', enabled: true },
                            { label: 'Mongolian', enabled: false },
                          ].map((lang) => (
                            <label
                              key={lang.label}
                              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                            >
                              {lang.label}
                              <input
                                type="checkbox"
                                defaultChecked={lang.enabled}
                                onChange={() => setPendingChanges(true)}
                                className="h-4 w-4 rounded border-slate-300 text-[#5D45DC] focus:ring-[#5D45DC]"
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Region & measurement units
                          </label>
                          <select
                            onChange={() => setPendingChanges(true)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
                          >
                            <option>South Korea (KRW • Square meters)</option>
                            <option>Myanmar (MMK • Square feet)</option>
                            <option>Global (USD • Square feet)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Number formatting
                          </label>
                          <select
                            onChange={() => setPendingChanges(true)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
                          >
                            <option>1,234,567.89</option>
                            <option>1.234.567,89</option>
                          </select>
                        </div>
                        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Translation management
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                            <button className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                              Import CSV
                            </button>
                            <button className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                              Export CSV
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                )}

                {settingsTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                      <h3 className="text-base font-semibold text-slate-900">Notification templates</h3>
                      <p className="text-sm text-slate-500">
                        Customize email content and toggle delivery channels for key workflows.
                      </p>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {[
                          'New listing approval',
                          'User registration',
                          'Password reset',
                          'Weekly market digest',
                        ].map((template) => (
                          <div key={template} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                            <p className="text-sm font-semibold text-slate-900">{template}</p>
                            <p className="mt-1 text-xs text-slate-500">Subject and message body configured.</p>
                            <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
                              <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                                Edit template
                              </button>
                              <label className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-slate-500">
                                <input
                                  type="checkbox"
                                  defaultChecked
                                  onChange={() => setPendingChanges(true)}
                                  className="h-4 w-4 rounded border-slate-300 text-[#5D45DC] focus:ring-[#5D45DC]"
                                />
                                Email
                              </label>
                              <label className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-slate-500">
                                <input
                                  type="checkbox"
                                  onChange={() => setPendingChanges(true)}
                                  className="h-4 w-4 rounded border-slate-300 text-[#5D45DC] focus:ring-[#5D45DC]"
                                />
                                In-app
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                      <h3 className="text-base font-semibold text-slate-900">Delivery channels</h3>
                      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                        <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1">
                          <input
                            type="checkbox"
                            defaultChecked
                            onChange={() => setPendingChanges(true)}
                            className="h-4 w-4 rounded border-slate-300 text-[#5D45DC] focus:ring-[#5D45DC]"
                          />
                          Email integration (SendGrid)
                        </label>
                        <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1">
                          <input
                            type="checkbox"
                            onChange={() => setPendingChanges(true)}
                            className="h-4 w-4 rounded border-slate-300 text-[#5D45DC] focus:ring-[#5D45DC]"
                          />
                          SMS (Twilio)
                        </label>
                        <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1">
                          <input
                            type="checkbox"
                            defaultChecked
                            onChange={() => setPendingChanges(true)}
                            className="h-4 w-4 rounded border-slate-300 text-[#5D45DC] focus:ring-[#5D45DC]"
                          />
                          Slack webhook
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'security' && (
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                          <h3 className="text-base font-semibold text-slate-900">Role permissions</h3>
                          <p className="text-sm text-slate-500">
                            Configure module access for each role. Changes apply immediately after saving.
                  </p>
                </div>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <input
                            type="checkbox"
                            defaultChecked
                            onChange={() => setPendingChanges(true)}
                            className="h-4 w-4 rounded border-slate-300 text-[#5D45DC] focus:ring-[#5D45DC]"
                          />
                          Two-factor authentication required
                        </label>
                      </div>
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-xs">
                          <thead className="bg-slate-50 text-slate-500">
                            <tr>
                              <th className="px-3 py-3 text-left font-semibold">Role</th>
                              {['News', 'Listings', 'Market', 'Users', 'Settings'].map((module) => (
                                <th key={module} className="px-3 py-3 text-center font-semibold">
                                  {module}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-600">
                            {['Admin', 'Editor', 'Agent', 'End-user'].map((role) => (
                              <tr key={role}>
                                <td className="px-3 py-3 font-semibold text-slate-900">{role}</td>
                                {['News', 'Listings', 'Market', 'Users', 'Settings'].map((module) => (
                                  <td key={module} className="px-3 py-3 text-center">
                                    <input
                                      type="checkbox"
                                      defaultChecked={role !== 'End-user'}
                                      onChange={() => setPendingChanges(true)}
                                      className="h-4 w-4 rounded border-slate-300 text-[#5D45DC] focus:ring-[#5D45DC]"
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                        <h3 className="text-base font-semibold text-slate-900">Password policy</h3>
                        <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                          Require at least 12 characters
                          <input
                            type="checkbox"
                            defaultChecked
                            onChange={() => setPendingChanges(true)}
                            className="h-4 w-4 rounded border-slate-300 text-[#5D45DC] focus:ring-[#5D45DC]"
                          />
                        </label>
                        <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                          Require symbols & numbers
                          <input
                            type="checkbox"
                            defaultChecked
                            onChange={() => setPendingChanges(true)}
                            className="h-4 w-4 rounded border-slate-300 text-[#5D45DC] focus:ring-[#5D45DC]"
                          />
                        </label>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Session timeout
                          </label>
                          <select
                            onChange={() => setPendingChanges(true)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
                          >
                            <option>30 minutes</option>
                            <option>1 hour</option>
                            <option>2 hours</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-3 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                        <h3 className="text-base font-semibold text-slate-900">Audit log</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                          {[
                            'Grace Lee enabled 2FA requirement • 2 minutes ago',
                            'Anthony Park updated listings permissions • 45 minutes ago',
                            'Myint Thu exported market overview report • Yesterday',
                          ].map((entry) => (
                            <li key={entry} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                              {entry}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'system' && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                      <h3 className="text-base font-semibold text-slate-900">System information</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                        <p className="font-semibold text-slate-900">Version</p>
                        <p>v5.2.0</p>
                        <p className="font-semibold text-slate-900">Environment</p>
                        <p>Production (KR)</p>
                        <p className="font-semibold text-slate-900">Last backup</p>
                        <p>Today, 03:05</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                        <button className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                          Download backup
                        </button>
                        <button className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-rose-300 hover:text-rose-500">
                          Restore backup
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                      <h3 className="text-base font-semibold text-slate-900">Subscription</h3>
                      <p className="text-sm text-slate-500">
                        Enterprise plan · 12 seats · Next billing cycle on 2025-12-01.
                      </p>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                        <p>
                          <span className="font-semibold text-slate-900">Usage:</span> 8/10 integrations • 6/10 custom
                          templates • Unlimited analytics exports.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <button className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                          Manage billing
                        </button>
                        <button className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]">
                          View invoices
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="fixed bottom-4 left-0 right-0 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm text-slate-500 shadow-lg shadow-slate-900/10 backdrop-blur">
              <span>{pendingChanges ? 'You have unsaved changes.' : 'All changes saved.'}</span>
                <div className="flex items-center gap-2">
                <button
                  onClick={() => setPendingChanges(false)}
                  className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-600 transition hover:border-[#5D45DC]/40 hover:text-[#5D45DC]"
                >
                  Reset to default
                  </button>
                <button
                  onClick={() => setPendingChanges(false)}
                  className={classNames(
                    'rounded-full px-4 py-2 font-semibold text-white shadow-lg shadow-[#5D45DC]/30 transition',
                    pendingChanges
                      ? 'bg-gradient-to-r from-[#5D45DC] to-[#AE9FFF] hover:from-[#4B36B6] hover:to-[#8E7CF8]'
                      : 'bg-slate-300 hover:bg-slate-400'
                  )}
                  disabled={!pendingChanges}
                >
                  Save changes
                  </button>
                </div>
              </div>
          </div>
        </section>
      ) : isListingsView ? (
        <section className="flex-1 bg-slate-50 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8">
            <div className="rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-lg shadow-slate-900/5">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">🏡 Real Estate Listings</h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Manage live and draft property inventory across KR / MM / EN markets.
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{filteredListings.filter((item) => item.status === 'Published').length} published</span>
                    <span className="h-4 w-px bg-slate-200" />
                    <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
                    <span>{filteredListings.filter((item) => item.status === 'Draft').length} drafts</span>
                  </div>
                  <button
                    onClick={openCreateListingModal}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0075C9] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#0075C9]/30 transition hover:bg-[#006CA6]"
                  >
                    <span className="text-lg leading-none">＋</span>
                    Add Listing
                  </button>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
                  <div className="flex min-w-[220px] flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 shadow-inner">
                    <span className="text-slate-400">🔍</span>
                    <input
                      value={listingSearch}
                      onChange={(event) => setListingSearch(event.target.value)}
                      className="flex-1 border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                      placeholder="Search by title or address..."
                    />
                  </div>
                  <select
                    value={listingCategoryFilter}
                    onChange={(event) => setListingCategoryFilter(event.target.value)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition focus:border-[#0075C9] focus:outline-none focus:ring-4 focus:ring-[#0075C9]/15"
                  >
                    {LISTING_CATEGORIES.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <select
                    value={listingStatusFilter}
                    onChange={(event) => setListingStatusFilter(event.target.value)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition focus:border-[#0075C9] focus:outline-none focus:ring-4 focus:ring-[#0075C9]/15"
                  >
                    {LISTING_STATUS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <select
                    value={listingLocationFilter}
                    onChange={(event) => setListingLocationFilter(event.target.value)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition focus:border-[#0075C9] focus:outline-none focus:ring-4 focus:ring-[#0075C9]/15"
                  >
                    {LISTING_LOCATIONS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={listingDateFilter}
                    onChange={(event) => setListingDateFilter(event.target.value)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition focus:border-[#0075C9] focus:outline-none focus:ring-4 focus:ring-[#0075C9]/15"
                    placeholder="Date added"
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                      {filteredListings.length} listings
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                      View: {listingsView.charAt(0).toUpperCase() + listingsView.slice(1)}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-semibold text-slate-500">
                    {[
                      { value: 'table', label: 'Table view' },
                      { value: 'cards', label: 'Card view' },
                      { value: 'map', label: 'Map view' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setListingsView(option.value)}
                    className={classNames(
                          'rounded-full px-4 py-1 transition',
                          listingsView === option.value
                            ? 'bg-white text-[#0075C9] shadow'
                            : 'hover:text-[#0075C9]'
                        )}
                      >
                        {option.label}
                  </button>
                ))}
                  </div>
                </div>
              </div>
              </div>

            <div className="space-y-6">
              {listingsView === 'table' && (
                <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-900/5">
                  {selectedListings.length > 0 && (
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      <span>
                        <strong className="font-semibold text-slate-900">{selectedListings.length}</strong> listings selected
                      </span>
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-[#0075C9]/40 hover:text-[#0075C9]">
                          Publish
                        </button>
                        <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-[#0075C9]/40 hover:text-[#0075C9]">
                          Mark as sold
                        </button>
                        <button
                          onClick={() => setSelectedListings([])}
                          className="rounded-full px-3 py-1 text-slate-400 transition hover:text-slate-600"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="overflow-hidden rounded-3xl border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50/80">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                          <th className="w-12 px-6 py-4">
                            <input
                              type="checkbox"
                              checked={isAllListingsSelected}
                              onChange={toggleSelectAllListings}
                              className="h-4 w-4 rounded border-slate-300 text-[#0075C9] focus:ring-[#0075C9]"
                            />
                          </th>
                          <th className="px-4 py-4">Listing</th>
                          <th className="px-4 py-4">Price</th>
                          <th className="px-4 py-4">Location</th>
                          <th className="px-4 py-4">Type</th>
                          <th className="px-4 py-4">Status</th>
                          <th className="px-4 py-4">Date posted</th>
                          <th className="px-4 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedListings.map((listing) => {
                          const isSelected = selectedListings.includes(listing.id)
                          return (
                            <tr
                              key={listing.id}
                              className={classNames(
                                'text-sm transition hover:bg-slate-50',
                                isSelected && 'bg-[#E2E8F0]/70'
                              )}
                            >
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectListing(listing.id)}
                                  className="h-4 w-4 rounded border-slate-300 text-[#0075C9] focus:ring-[#0075C9]"
                                />
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-16 overflow-hidden rounded-xl bg-slate-100 shadow-inner">
                                    <img src={listing.thumbnail} alt={listing.title} className="h-full w-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">{listing.title}</p>
                                    <p className="text-xs text-slate-400">{listing.category}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm font-semibold text-slate-900">{listing.price}</td>
                              <td className="px-4 py-4 text-sm text-slate-600">{listing.location}</td>
                              <td className="px-4 py-4 text-sm text-slate-600">{listing.type}</td>
                              <td className="px-4 py-4">
                                <StatusBadge status={listing.status} />
                              </td>
                              <td className="px-4 py-4 text-sm text-slate-500">
                                {new Date(listing.datePosted).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-end gap-2 text-xs font-semibold">
                                  <button
                                    onClick={() => openEditListingModal(listing)}
                                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-500 transition hover:border-[#0075C9]/40 hover:text-[#0075C9]"
                                  >
                                    <span className="text-base leading-none">🖊️</span>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleListingDeleteRequest(listing)}
                                    className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-500 transition hover:border-rose-300 hover:bg-rose-100"
                                  >
                                    <span className="text-base leading-none">🗑️</span>
                                    Delete
                                  </button>
                                  <button className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-500 transition hover:border-[#0075C9]/40 hover:text-[#0075C9]">
                                    <span className="text-base leading-none">👁️</span>
                                    View
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                        {paginatedListings.length === 0 && (
                          <tr>
                            <td colSpan={8} className="px-6 py-12 text-center">
                              <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-slate-500">
                                <span className="text-4xl">🏗️</span>
                                <p className="text-sm font-semibold">No listings found for the current filters.</p>
                                <p className="text-xs text-slate-400">Adjust the filters or reset to view all properties.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                    <div>
                      Showing{' '}
                      <span className="font-semibold text-slate-900">{paginatedListings.length > 0 ? listingRangeStart : 0}</span>{' '}
                      –{' '}
                      <span className="font-semibold text-slate-900">{listingRangeEnd}</span> of{' '}
                      <span className="font-semibold text-slate-900">{filteredListings.length}</span> listings
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setListingPage((prev) => Math.max(1, prev - 1))}
                        className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-500 transition hover:border-[#0075C9]/40 hover:text-[#0075C9] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={listingPage === 1}
                      >
                        Prev
                      </button>
                      <div className="flex items-center gap-1">
                        {listingPageNumbers.slice(0, 4).map((page) => (
                          <button
                            key={page}
                            onClick={() => setListingPage(page)}
                            className={classNames(
                              'h-9 w-9 rounded-full text-sm font-semibold transition',
                              page === listingPage
                                ? 'bg-[#0075C9] text-white shadow-md shadow-[#0075C9]/40'
                                : 'border border-slate-200 text-slate-500 hover:border-[#0075C9]/40 hover:text-[#0075C9]'
                            )}
                          >
                            {page}
                          </button>
                        ))}
                        {totalListingPages > 4 && <span className="px-1 text-xs text-slate-400">...</span>}
                      </div>
                      <button
                        onClick={() => setListingPage((prev) => Math.min(totalListingPages, prev + 1))}
                        className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-500 transition hover:border-[#0075C9]/40 hover:text-[#0075C9] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={listingPage === totalListingPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {listingsView === 'cards' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {paginatedListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow-md shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div className="relative h-44 overflow-hidden rounded-t-3xl bg-slate-100">
                          <img src={listing.thumbnail} alt={listing.title} className="h-full w-full object-cover" />
                          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0075C9]">
                            {listing.category}
                          </span>
              </div>
                        <div className="flex flex-1 flex-col gap-4 px-5 py-5">
                          <div>
                            <h3 className="text-base font-semibold text-slate-900">{listing.title}</h3>
                            <p className="mt-1 text-sm text-slate-500">{listing.location}</p>
            </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-[#0075C9]">{listing.price}</span>
                            <StatusBadge status={listing.status} />
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                            {listing.features.slice(0, 3).map((feature) => (
                              <span key={feature} className="rounded-full bg-slate-100 px-3 py-1">
                                {feature}
                              </span>
                            ))}
                            {listing.features.length === 0 && (
                              <span className="rounded-full bg-slate-100 px-3 py-1">Standard features</span>
                            )}
                          </div>
                          <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
                            <span>{new Date(listing.datePosted).toLocaleDateString()}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditListingModal(listing)}
                                className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-[#0075C9]/40 hover:text-[#0075C9]"
                              >
                                🖊️ Edit
                              </button>
                              <button
                                onClick={() => handleListingDeleteRequest(listing)}
                                className="rounded-full border border-rose-200 px-3 py-1 text-rose-500 transition hover:border-rose-300 hover:bg-rose-50"
                              >
                                🗑️ Delete
                              </button>
                              <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-[#0075C9]/40 hover:text-[#0075C9]">
                                👁️ View
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {paginatedListings.length === 0 && (
                      <div className="col-span-full">
                        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-8 py-12 text-center text-slate-500">
                          <span className="text-4xl">🏗️</span>
                          <p className="text-sm font-semibold">No listings match the current filters.</p>
                          <p className="text-xs text-slate-400">
                            Try adjusting your search, or add a new listing to get started.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-500 shadow-md shadow-slate-900/5 md:flex-row md:items-center md:justify-between">
                    <div>
                      Showing{' '}
                      <span className="font-semibold text-slate-900">{paginatedListings.length > 0 ? listingRangeStart : 0}</span>{' '}
                      –{' '}
                      <span className="font-semibold text-slate-900">{listingRangeEnd}</span> of{' '}
                      <span className="font-semibold text-slate-900">{filteredListings.length}</span> listings
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setListingPage((prev) => Math.max(1, prev - 1))}
                        className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-500 transition hover:border-[#0075C9]/40 hover:text-[#0075C9] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={listingPage === 1}
                      >
                        Prev
                      </button>
                      <div className="flex items-center gap-1">
                        {listingPageNumbers.slice(0, 4).map((page) => (
                          <button
                            key={page}
                            onClick={() => setListingPage(page)}
                            className={classNames(
                              'h-9 w-9 rounded-full text-sm font-semibold transition',
                              page === listingPage
                                ? 'bg-[#0075C9] text-white shadow-md shadow-[#0075C9]/40'
                                : 'border border-slate-200 text-slate-500 hover:border-[#0075C9]/40 hover:text-[#0075C9]'
                            )}
                          >
                            {page}
                          </button>
                        ))}
                        {totalListingPages > 4 && <span className="px-1 text-xs text-slate-400">...</span>}
                      </div>
                      <button
                        onClick={() => setListingPage((prev) => Math.min(totalListingPages, prev + 1))}
                        className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-500 transition hover:border-[#0075C9]/40 hover:text-[#0075C9] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={listingPage === totalListingPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {listingsView === 'map' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5 lg:col-span-8">
                <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-slate-900">Map preview</h3>
                      <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-[#0075C9]/40 hover:text-[#0075C9]">
                        Open full map
                  </button>
                </div>
                    <div className="mt-6 h-[420px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#0075C9]/15 via-slate-100 to-[#006CA6]/10">
                      <div className="relative h-full w-full">
                        {filteredListings.map((listing, index) => (
                          <div
                            key={listing.id}
                            className="absolute flex flex-col items-center gap-1 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-[#0075C9] shadow-md shadow-[#0075C9]/20"
                            style={{
                              top: `${15 + (index * 12) % 70}%`,
                              left: `${20 + (index * 17) % 60}%`,
                            }}
                          >
                            <span className="text-lg leading-none">📍</span>
                            <span>{listing.location.split(' · ')[0]}</span>
                      </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5 lg:col-span-4">
                    <h3 className="text-base font-semibold text-slate-900">Highlights</h3>
                    <ul className="space-y-3 text-sm text-slate-600">
                      {filteredListings.slice(0, 6).map((listing) => (
                        <li key={listing.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                          <p className="text-sm font-semibold text-slate-900">{listing.title}</p>
                          <p className="text-xs text-slate-500">{listing.location}</p>
                          <p className="mt-1 text-sm font-semibold text-[#0075C9]">{listing.price}</p>
                        </li>
                      ))}
                    </ul>
                    {filteredListings.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                        Add listings or adjust filters to populate the map.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : isNewsView ? (
        <section className="flex-1 bg-slate-50 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8">
            <div className="rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-lg shadow-slate-900/5">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div>
                  <h1 className="text-2xl font-semibold text-slate-900">📰 News Management</h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Curate stories, track publication status, and coordinate newsroom updates across all channels.
                  </p>
                        </div>
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    <span>6 articles live</span>
                    <span className="h-4 w-px bg-slate-200" />
                    <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
                    <span>2 drafts pending</span>
                      </div>
                  <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700"
                  >
                    <span className="text-lg leading-none">＋</span>
                    Add News
                  </button>
                    </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="col-span-1 space-y-6 lg:col-span-9">
                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-md shadow-slate-900/5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 shadow-inner">
                      <span className="text-slate-400">🔍</span>
                      <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="flex-1 border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                        placeholder="Search by title or author..."
                      />
                    </div>
                    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <select
                        value={selectedCategory}
                        onChange={(event) => setSelectedCategory(event.target.value)}
                        className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition focus:border-[#0075C9] focus:outline-none focus:ring-4 focus:ring-[#0075C9]/15"
                      >
                        {CATEGORY_OPTIONS.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                      <select
                        value={selectedStatus}
                        onChange={(event) => setSelectedStatus(event.target.value)}
                        className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition focus:border-[#0075C9] focus:outline-none focus:ring-4 focus:ring-[#0075C9]/15"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(event) => setDateFrom(event.target.value)}
                        className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition focus:border-[#0075C9] focus:outline-none focus:ring-4 focus:ring-[#0075C9]/15"
                        placeholder="From"
                      />
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(event) => setDateTo(event.target.value)}
                        className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition focus:border-[#0075C9] focus:outline-none focus:ring-4 focus:ring-[#0075C9]/15"
                        placeholder="To"
                      />
                </div>
              </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50/80">
                      <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <th className="w-12 px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={toggleSelectAll}
                            className="h-4 w-4 rounded border-slate-300 text-[#0075C9] focus:ring-[#0075C9]"
                          />
                        </th>
                        <th className="px-4 py-4">Thumbnail</th>
                        <th className="px-4 py-4">Title</th>
                        <th className="px-4 py-4">Category</th>
                        <th className="px-4 py-4">Author</th>
                        <th className="px-4 py-4">Date Published</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-4 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedNews.map((news) => {
                        const isSelected = selectedNews.includes(news.id)
                        return (
                          <tr
                            key={news.id}
                            className={classNames(
                              'text-sm transition hover:bg-slate-50',
                              isSelected && 'bg-[#E2E8F0]/70'
                            )}
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectRow(news.id)}
                                className="h-4 w-4 rounded border-slate-300 text-[#0075C9] focus:ring-[#0075C9]"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex h-12 w-16 items-center overflow-hidden rounded-xl bg-slate-100 shadow-inner">
                                <img
                                  src={news.thumbnail}
                                  alt={news.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="font-semibold text-slate-900">{news.title}</span>
                                <span className="text-xs text-slate-400">{news.id}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-slate-500">{news.category}</td>
                            <td className="px-4 py-4 text-slate-500">{news.author}</td>
                            <td className="px-4 py-4 text-slate-500">
                              {new Date(news.publishedAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4">
                              <StatusBadge status={news.status} />
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-end gap-2 text-xs font-semibold">
                                <button
                                  onClick={() => openEditModal(news)}
                                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-500 transition hover:border-[#0075C9]/40 hover:text-[#0075C9]"
                                >
                                  <span className="text-base leading-none">🖊️</span>
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteRequest(news)}
                                  className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-500 transition hover:border-rose-300 hover:bg-rose-100"
                                >
                                  <span className="text-base leading-none">🗑️</span>
                                  Delete
                  </button>
                </div>
                            </td>
                          </tr>
                        )
                      })}
                      {paginatedNews.length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center">
                            <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-slate-500">
                              <span className="text-4xl">📄</span>
                              <p className="text-sm font-semibold">
                                No news articles match the current filters.
                              </p>
                              <p className="text-xs text-slate-400">
                                Adjust your search keywords or reset the filters to view additional stories.
                    </p>
                  </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/70 px-6 py-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                    <div>
                      Showing{' '}
                      <span className="font-semibold text-slate-900">
                        {paginatedNews.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
                      </span>{' '}
                      –{' '}
                      <span className="font-semibold text-slate-900">
                        {(currentPage - 1) * pageSize + paginatedNews.length}
                      </span>{' '}
                      of <span className="font-semibold text-slate-900">{filteredNews.length}</span>{' '}
                      articles
                  </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-500 transition hover:border-[#0075C9]/40 hover:text-[#0075C9] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                      <div className="flex items-center gap-1">
                        {pageNumbers.slice(0, 4).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={classNames(
                              'h-9 w-9 rounded-full text-sm font-semibold transition',
                              page === currentPage
                                ? 'bg-[#0075C9] text-white shadow-md shadow-[#0075C9]/40'
                                : 'border border-slate-200 text-slate-500 hover:border-[#0075C9]/40 hover:text-[#0075C9]'
                            )}
                          >
                            {page}
                          </button>
                        ))}
                        {totalPages > 4 && <span className="px-1 text-xs text-slate-400">...</span>}
                      </div>
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-500 transition hover:border-[#0075C9]/40 hover:text-[#0075C9] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 space-y-6 lg:col-span-3">
                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">Editorial Summary</h3>
                    <span className="rounded-full bg-[#E2E8F0] px-3 py-1 text-xs font-semibold text-slate-600">
                      Today
                    </span>
                  </div>
                  <div className="mt-5 space-y-4 text-sm text-slate-600">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span>Scheduled stories</span>
                      <span className="text-base font-semibold text-slate-900">08</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span>Drafts awaiting review</span>
                      <span className="text-base font-semibold text-[#F59E0B]">02</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span>Avg. publish turnaround</span>
                      <span className="text-base font-semibold text-slate-900">18h</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-md shadow-slate-900/5">
                  <h3 className="text-sm font-semibold text-slate-900">Team Activity</h3>
                  <ul className="mt-4 space-y-4 text-sm text-slate-600">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-base">✍️</span>
                      <div>
                        <p className="font-semibold text-slate-800">Grace Lee</p>
                        <p>Updated the smart home adoption report.</p>
                        <p className="text-xs text-slate-400">12 minutes ago</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-base">🖼️</span>
                      <div>
                        <p className="font-semibold text-slate-800">Myint Thu</p>
                        <p>Added gallery assets to waterfront district story.</p>
                        <p className="text-xs text-slate-400">43 minutes ago</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-base">🚀</span>
                      <div>
                        <p className="font-semibold text-slate-800">Hana Choi</p>
                        <p>Scheduled subsidy update for KR/EN at 6:00 PM.</p>
                        <p className="text-xs text-slate-400">1 hour ago</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-dashed border-[#0075C9]/30 bg-[#0075C9]/5 px-6 py-6 shadow-inner">
                  <h3 className="text-sm font-semibold text-[#006CA6]">Quick Tips</h3>
                  <ul className="mt-3 space-y-2 text-xs text-[#006CA6]">
                    <li>• Drag and drop assets directly into the upload box.</li>
                    <li>• Use categories to power homepage personalization.</li>
                    <li>• Toggle “Publish” to push updates instantly.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="flex-1 bg-slate-50 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex h-full max-w-[1400px] flex-col items-center justify-center text-center">
            <div className="max-w-lg rounded-3xl border border-dashed border-slate-200 bg-white px-10 py-12 shadow-lg shadow-slate-900/5">
              <h2 className="text-2xl font-semibold text-slate-900">{activeNav} workspace</h2>
              <p className="mt-3 text-sm text-slate-500">
                This section is slated for a future upgrade. In the meantime, explore Dashboard Overview or News
                Management for the most active workflows.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => setActiveNav('Dashboard Overview')}
                  className="inline-flex items-center justify-center rounded-full bg-[#0075C9] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-[#0075C9]/30 transition hover:bg-[#006CA6]"
                >
                  Go to Dashboard Overview
                </button>
                <button
                  onClick={() => setActiveNav('News Management')}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#0075C9]/40 hover:text-[#0075C9]"
                >
                  Open News Management
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      </main>

    {listingModalOpen && (
      <ModalShell
        title={listingModalMode === 'create' ? 'Add Listing' : 'Edit Listing'}
        description={
          listingModalMode === 'create'
            ? 'Provide the property details to publish a new listing.'
            : 'Update listing information before saving changes.'
        }
        onClose={closeListingModal}
      >
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            closeListingModal()
          }}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Title
                </label>
                <input
                  value={listingForm.title}
                  onChange={(event) =>
                    setListingForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#0075C9] focus:outline-none focus:ring-4 focus:ring-[#0075C9]/15"
                  placeholder="Listing headline"
                  required
                />
    </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </label>
                  <select
                    value={listingForm.category}
                    onChange={(event) =>
                      setListingForm((prev) => ({ ...prev, category: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#0075C9] focus:outline-none focus:ring-4 focus:ring-[#0075C9]/15"
                  >
                    {LISTING_CATEGORIES.filter((option) => option !== 'All').map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Location
                  </label>
                  <select
                    value={listingForm.location}
                    onChange={(event) =>
                      setListingForm((prev) => ({ ...prev, location: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#0075C9] focus:outline-none focus:ring-4 focus:ring-[#0075C9]/15"
                  >
                    {LISTING_LOCATIONS.filter((option) => option !== 'All').map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Price
                </label>
                <input
                  value={listingForm.price}
                  onChange={(event) =>
                    setListingForm((prev) => ({ ...prev, price: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#0075C9] focus:outline-none focus:ring-4 focus:ring-[#0075C9]/15"
                  placeholder="₩0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Address
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={listingForm.address}
                    onChange={(event) =>
                      setListingForm((prev) => ({ ...prev, address: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#0075C9] focus:outline-none focus:ring-4 focus:ring-[#0075C9]/15"
                    placeholder="Enter street and number"
                  />
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#0075C9]/40 hover:text-[#0075C9]"
                  >
                    Map picker
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </label>
                <StatusToggle
                  value={listingForm.status}
                  onChange={(status) => setListingForm((prev) => ({ ...prev, status }))}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </label>
                <RichTextEditor
                  value={listingForm.description}
                  onChange={(value) => setListingForm((prev) => ({ ...prev, description: value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Upload images
                </label>
                <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-500 transition hover:border-[#0075C9]/40 hover:bg-[#0075C9]/5">
                  <span className="text-3xl">📷</span>
                  <span>
                    Drag & drop property photos<br />
                    <span className="text-xs text-slate-400">You can upload multiple images at once</span>
                  </span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleListingImageUpload} />
                </label>
                {listingImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {listingImages.map((image) => (
                      <div key={image} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        <img src={image} alt="Listing preview" className="h-28 w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveListingImage(image)}
                          className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-rose-500 opacity-0 transition group-hover:opacity-100"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Features
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {LISTING_FEATURES.map((feature) => (
                    <label
                      key={feature}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 transition hover:border-[#0075C9]/40"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-[#0075C9] focus:ring-[#0075C9]"
                        checked={listingFeatureSelections.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                      />
                      {feature}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeListingModal}
              className="w-full rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-full bg-[#0075C9] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-[#0075C9]/40 transition hover:bg-[#006CA6] sm:w-auto"
            >
              Save Listing
            </button>
          </div>
        </form>
      </ModalShell>
    )}

    {usersModalOpen && (
      <ModalShell
        title={usersModalMode === 'create' ? 'Add User' : 'Edit User'}
        description={
          usersModalMode === 'create'
            ? 'Create a new user account and assign roles for the platform.'
            : 'Update user details, roles, and account status.'
        }
        onClose={closeUsersModal}
      >
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            closeUsersModal()
          }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </label>
              <input
                value={userForm.name}
                onChange={(event) => setUserForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
                placeholder="Full name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </label>
              <input
                type="email"
                value={userForm.email}
                onChange={(event) => setUserForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
                placeholder="user@tofu.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone
              </label>
              <input
                value={userForm.phone}
                onChange={(event) => setUserForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
                placeholder="+82 10-1234-5678"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Role
              </label>
              <select
                value={userForm.role}
                onChange={(event) => setUserForm((prev) => ({ ...prev, role: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
              >
                {USERS_ROLES.filter((option) => option !== 'All').map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </label>
              <div className="inline-grid grid-cols-3 overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold">
                {['Active', 'Inactive', 'Suspended'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setUserForm((prev) => ({ ...prev, status }))}
                    className={classNames(
                      'px-4 py-1.5 transition',
                      userForm.status === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Password
              </label>
              <input
                type="password"
                value={userForm.password}
                onChange={(event) => setUserForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-[#5D45DC] focus:outline-none focus:ring-4 focus:ring-[#5D45DC]/15"
                placeholder={usersModalMode === 'create' ? 'Set initial password' : 'Leave blank to keep current'}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeUsersModal}
              className="w-full rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-full bg-[#5D45DC] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-[#5D45DC]/40 transition hover:bg-[#4B36B6] sm:w-auto"
            >
              Save User
            </button>
          </div>
        </form>
      </ModalShell>
    )}

    {isModalOpen && (
      <ModalShell
        title={modalMode === 'create' ? 'Add News Article' : 'Edit News Article'}
        description={
          modalMode === 'create'
            ? 'Fill out the form to create a new newsroom update for the portal.'
            : 'Update the details of this story before re-publishing.'
        }
        onClose={closeModal}
      >
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            closeModal()
          }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Title
              </label>
              <input
                value={modalForm.title}
                onChange={(event) =>
                  setModalForm((prev) => ({ ...prev, title: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                placeholder="Enter headline"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </label>
              <select
                value={modalForm.category}
                onChange={(event) =>
                  setModalForm((prev) => ({ ...prev, category: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              >
                {CATEGORY_OPTIONS.filter((option) => option !== 'All').map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description / Content
              </label>
              <RichTextEditor
                value={modalForm.description}
                onChange={(value) => setModalForm((prev) => ({ ...prev, description: value }))}
              />
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Upload Thumbnail
                </label>
                <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50/40">
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="Preview" className="h-36 w-full rounded-2xl object-cover" />
                  ) : (
                    <>
                      <span className="text-3xl">🖼️</span>
                      <span>
                        Drag & drop cover image <br />
                        <span className="text-xs text-slate-400">(Recommended 1200 × 630)</span>
                      </span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </label>
                <StatusToggle
                  value={modalForm.status}
                  onChange={(status) => setModalForm((prev) => ({ ...prev, status }))}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="w-full rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-700 sm:w-auto"
            >
              Save News
            </button>
          </div>
        </form>
      </ModalShell>
    )}

    <DeleteConfirm
      open={listingDeleteOpen}
      onCancel={handleListingDeleteCancel}
      onConfirm={handleListingDeleteConfirm}
      itemTitle={listingToDelete?.title}
      entityLabel="this listing"
    />

    <DeleteConfirm
      open={userDeleteOpen}
      onCancel={handleUserDeleteCancel}
      onConfirm={handleUserDeleteConfirm}
      itemTitle={userToDelete?.name}
      entityLabel={
        selectedUsers.length > 1
          ? `these ${selectedUsers.length} users`
          : userToDelete
            ? 'this user'
            : 'these users'
      }
    />

    <DeleteConfirm
      open={isDeleteOpen}
      onCancel={handleDeleteCancel}
      onConfirm={handleDeleteConfirm}
      itemTitle={newsToDelete?.title}
      entityLabel="this news article"
    />
  </div>
)
}

export default AdminDashboardPage