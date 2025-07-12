import React from 'react'

const Footer = () => {
  return (
<footer className="p-4 border-t border-golden-yellow bg-cream">
  <div className="w-full sm:flex sm:items-center sm:justify-between px-4">
    <div className="font-bold text-xl text-dark-olive">
     <h1>FEEDJOY</h1>
    </div>

    <div className="text-sm text-dark-olive">
      &copy; 2024 FeedJoy. All rights reserved.
    </div>
  </div>
</footer>
  )
}

export default Footer