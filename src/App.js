import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Header from "./components/Header";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";
import UserListing from './pages/UserListing';
import ProfileLayout from "./components/ProfileLayout";
import Chat from "./pages/Chat";
import ChatList from "./pages/ChatList";
import Notifications from "./pages/Notifications";
 

function App() {
  return (
    <>
      <Router>
        <Header />
        <div className="bg-cream">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<PrivateRoute />}>
            <Route element={<ProfileLayout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/View-listing" element={<UserListing />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/chats" element={<ChatList />} />
            </Route>
            <Route path="/chat/:receiverId" element={<Chat />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/listing/:listingId" element={<Listing />} />
          <Route path="/offers" element={<Offers />} />
          
          <Route path="edit-listing" element={<PrivateRoute/>}>
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
          </Route>
        </Routes>
        </div>
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
    </>
  );
}

export default App;


