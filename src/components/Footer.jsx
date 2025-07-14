import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark-olive text-cream">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-golden-yellow mb-4">
              FeedJoy
            </h3>
            <p className="text-cream/80">
              Reducing food waste and ending hunger by connecting communities.
              Your surplus can be someone's sustenance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-golden-yellow mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-golden-yellow transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="hover:text-golden-yellow transition-colors"
                >
                  Donations
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-golden-yellow transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="text-xl font-bold text-golden-yellow mb-4">
              Connect With Us
            </h3>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <FaEnvelope />
              <a
                href="mailto:contact@feedjoy.com"
                className="hover:text-golden-yellow transition-colors"
              >
                contact@feedjoy.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-golden-yellow/20 text-center text-cream/60">
          <p>&copy; {new Date().getFullYear()} FeedJoy. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;