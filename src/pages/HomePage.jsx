import React from 'react'
import Header from '../components/layout/Header'
import SearchHero from '../features/home/SearchHero'
import ServiceGrid from '../features/home/ServiceGrid'
import MarketFeed from '../features/home/MarketFeed'
import Footer from '../components/layout/Footer'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-dabang-background">
      <Header />
      <SearchHero />
      <ServiceGrid />
      <MarketFeed />
      <Footer />
    </div>
  )
}

export default HomePage