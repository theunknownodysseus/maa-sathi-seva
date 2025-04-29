
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, PhoneCall, Clock, HelpCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-maternal-light dark:bg-maternal-dark text-maternal-dark dark:text-maternal-light mt-auto">
      <div className="container py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Maa Sathi Seva</h3>
            <p className="text-sm mb-4">
              Supporting mothers through every stage of pregnancy and beyond with accessible healthcare resources.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" aria-label="Facebook" className="hover:text-maternal-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-maternal-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195A4.92 4.92 0 0012 9.75v.75A13.98 13.98 0 011.64 5.195 4.92 4.92 0 003.3 11.7A4.892 4.892 0 011.4 10.9v.05A4.92 4.92 0 006.038 15.7a4.9 4.9 0 01-2.3.088A4.92 4.92 0 008.342 18.3a9.85 9.85 0 01-7.24 2.025A13.9 13.9 0 0021.453 7.195a9.96 9.96 0 002.5-2.625z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-maternal-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/resources" className="flex items-center hover:text-maternal-primary">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Health Resources
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="flex items-center hover:text-maternal-primary">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Government Schemes
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="flex items-center hover:text-maternal-primary">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Book Appointments
                </Link>
              </li>
              <li>
                <Link to="/profile" className="flex items-center hover:text-maternal-primary">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  My Health Records
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="flex items-center hover:text-maternal-primary">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Emergency Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact & Support</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <PhoneCall className="h-4 w-4 mr-2" />
                Emergency: <a href="tel:108" className="ml-1 hover:text-maternal-primary">108</a>
              </li>
              <li className="flex items-center">
                <PhoneCall className="h-4 w-4 mr-2" />
                Helpline: <a href="tel:1800-XXX-XXXX" className="ml-1 hover:text-maternal-primary">1800-XXX-XXXX</a>
              </li>
              <li className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Available 24/7
              </li>
              <li className="flex items-center mt-4">
                <HelpCircle className="h-4 w-4 mr-2" />
                <a href="#" className="hover:text-maternal-primary">Frequently Asked Questions</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-maternal-dark/10 dark:border-maternal-light/10 text-sm text-center">
          <p>© {new Date().getFullYear()} Maa Sathi Seva. All rights reserved.</p>
          <p className="mt-2">
            <Link to="/privacy" className="hover:text-maternal-primary">Privacy Policy</Link>
            {' • '}
            <Link to="/terms" className="hover:text-maternal-primary">Terms of Use</Link>
            {' • '}
            <Link to="/accessibility" className="hover:text-maternal-primary">Accessibility</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
