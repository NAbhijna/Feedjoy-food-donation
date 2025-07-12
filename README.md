# FeedJoy - Food Donation Platform 🍽️

A React-based web application that connects people with surplus food to those in need, helping reduce food waste while addressing hunger in communities.

## 🌟 Features

- **User Authentication**: Secure sign-up/sign-in with email/password and Google OAuth
- **Food Listings**: Create, edit, and delete food donation listings
- **Browse Donations**: View available food donations with detailed information
- **Contact System**: Direct communication between donors and recipients
- **User Profiles**: Manage personal information and view listing history
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Real-time Updates**: Live synchronization with Firebase backend

## 🛠️ Tech Stack

- **Frontend**: React.js with functional components and hooks
- **Styling**: Tailwind CSS for responsive design
- **Backend & Database**: Firebase Firestore for data storage
- **Authentication**: Firebase Auth with email/password and Google provider
- **File Storage**: Firebase Storage for image uploads
- **Routing**: React Router for navigation
- **State Management**: React hooks (useState, useEffect)
- **Notifications**: React Toastify for user feedback

## 📁 Project Structure

```
feedjoy-food-donation/
├── src/
│   ├── components/
│   │   ├── Contact.jsx          # Contact form component
│   │   ├── Footer.jsx           # Footer component
│   │   ├── Header.jsx           # Navigation header
│   │   ├── ListingItem.jsx      # Individual listing display
│   │   ├── OAuth.jsx            # Google authentication
│   │   ├── Post.jsx             # Featured posts section
│   │   ├── Section.jsx          # Landing page sections
│   │   ├── Spinner.jsx          # Loading spinner
│   │   ├── Stats.jsx            # Statistics display
│   │   └── styles/
│   │       └── PofileLayout/    # Profile page layout
│   ├── pages/
│   │   ├── CreateListing.jsx    # Create new food listing
│   │   ├── EditListing.jsx      # Edit existing listing
│   │   ├── ForgotPassword.jsx   # Password reset
│   │   ├── Home.jsx             # Landing page
│   │   ├── Listing.jsx          # Individual listing view
│   │   ├── Offers.jsx           # Browse all listings
│   │   ├── Profile.jsx          # User profile
│   │   ├── SignIn.jsx           # Login page
│   │   ├── SignUp.jsx           # Registration page
│   │   └── UserListing.jsx      # User's own listings
│   ├── firebase.js              # Firebase configuration
│   ├── App.js                   # Main app component
│   └── index.js                 # App entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/feedjoy-food-donation.git
   cd feedjoy-food-donation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication (Email/Password and Google)
   - Enable Storage
   - Copy your Firebase config and update `src/firebase.js`

4. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

1. **For Donors**:
   - Sign up/Login to the platform
   - Create listings with food details, quantity, expiry date
   - Upload photos of the food
   - Manage your active listings
   - Respond to interested recipients

2. **For Recipients**:
   - Browse available food donations
   - Contact donors directly through the platform
   - View detailed information about food items
   - Express interest in specific donations

## 📱 Key Pages

- **Home**: Landing page with featured donations and platform overview
- **Offers**: Browse all available food donations
- **Profile**: User dashboard for managing account and listings
- **Create Listing**: Form to post new food donations
- **Listing Details**: Detailed view of individual food items

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🌍 Contributing

We welcome contributions to make FeedJoy better! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you encounter any issues or have questions, please:
- Open an issue on GitHub
- Contact us at support@feedjoy.com

## 🙏 Acknowledgments

- Thanks to all contributors who help fight food waste
- Firebase for providing excellent backend services
- Tailwind CSS for the beautiful UI components

---

**Together, we can reduce food waste and help feed communities in need! 🌟**
