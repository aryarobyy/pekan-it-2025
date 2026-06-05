import { Link } from "react-router";

type FooterProps = {
  className?: string;
};

const Footer: React.FC<FooterProps> = ({ className = "", ...rest }) => {
  return (
    <footer className={`bg-transparent py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 ${className}`}>
      <div className="max-w-6xl mx-auto border-t border-slate-400 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="col-span-1 text-center sm:text-left">
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">
              AcaConnect
            </h2>
            <p className="text-slate-200 text-sm">Academy & Connection</p>
          </div>

          <div className="col-span-1">
            <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center sm:text-left">
              Navigation
            </h3>
            <ul className="space-y-2 text-center sm:text-left">
              <li>
                <Link
                  to="#"
                  className="text-slate-200 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-200 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Find Friends
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-200 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Grade
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-200 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Chats
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-200 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Tugas & Fokus
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center sm:text-left">
              Resources
            </h3>
            <ul className="space-y-2 text-center sm:text-left">
              <li>
                <Link
                  to="#"
                  className="text-slate-200 hover:text-white transition-colors text-sm sm:text-base"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-200 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-200 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-200 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-200 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="bg-slate-700 p-4 sm:p-6 rounded-xl sm:rounded-2xl w-full max-w-sm mx-auto lg:max-w-none">
              <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center lg:text-left">
                Contact
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-slate-200 text-xs sm:text-sm block mb-1 sm:mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 sm:px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="text-slate-200 text-xs sm:text-sm block mb-1 sm:mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 sm:px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base font-medium">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-400 pt-6 sm:pt-8">
          <p className="text-slate-200 text-center text-xs sm:text-sm">
            © 2025 AcaConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
