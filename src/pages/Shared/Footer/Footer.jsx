import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

        {/* Brand */}
        <div>
          <h3 className="text-white text-xl font-bold mb-3">🍲 LocalChefBazaar</h3>
          <p className="text-sm text-gray-400">
            Connecting home cooks with food lovers. Fresh, homemade meals delivered to your door.
          </p>
        </div>

        {/* Working Hours */}
        <div>
          <h4 className="text-white font-semibold mb-3">Working Hours</h4>
          <ul className="text-sm space-y-1 text-gray-400">
            <li>Monday – Friday: 8am – 10pm</li>
            <li>Saturday: 9am – 9pm</li>
            <li>Sunday: 10am – 8pm</li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <p className="text-sm text-gray-400">📧 support@localchefbazaar.com</p>
          <p className="text-sm text-gray-400">📞 +880 1700 000000</p>
          <div className="flex gap-4 mt-3">
                            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-black hover:text-white transition-all">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-black hover:text-white transition-all">
                                <FaXTwitter size={20} /> 
                            </a>
                            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-black hover:text-white transition-all">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-black hover:text-white transition-all">
                                <FaLinkedin size={20} />
                            </a>
                        </div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} LocalChefBazaar. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;