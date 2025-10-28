import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
             <div className="mb-4">
                <span className="bg-yellow-400 text-black text-2xl font-bold px-4 py-1 rounded-full">
                  RideLink
                </span>
             </div>
             <p className="text-sm">AI-Powered Journeys. <br/> Unbeatable Trust.</p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4 tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4 tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Passenger Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Driver Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Corporate Affairs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
            </ul>
          </div>

           {/* Social Links */}
           <div>
            <h3 className="text-base font-semibold text-white mb-4 tracking-wider">Follow Us</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} RideLink India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
