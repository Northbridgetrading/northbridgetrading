import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* CONTACT US */}
        <div>
          <h3 className="uppercase font-semibold mb-4 text-white">CONTACT US</h3>
          <p className="font-semibold mb-2">Tel.: +234 803 456 7890</p>
          <p className="font-semibold mb-2 leading-relaxed">
            28 HAROLDWILSON DRIVE, BORO KIRI,<br />
            BOROKIRI, RIVERS STATE
          </p>
          <p className="text-xs mb-4">
            Reception from 7:30am to 8:00pm (Monday to Friday), by appointment.
          </p>
          <button className="border border-[#e63946] px-4 py-2 text-[#e63946] font-semibold hover:bg-[#e63946] hover:text-white transition">
            Contact Zettatonne
          </button>
        </div>

        {/* ZETTATONNE.COM */}
        <div className="flex gap-12">
          <div>
            <h3 className="uppercase font-semibold mb-4 text-white">ZETTATONNE.COM</h3>
            <p className="font-semibold mb-2">Our actions</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Taking action for the climate</li>
              <li>Optimizing resources through the circular economy</li>
              <li>Preserving natural environments</li>
              <li>Being a responsible employer</li>
              <li>Respect human rights</li>
              <li>Ensuring health and safety</li>
              <li>Acting as a partner of the territories</li>
              <li>Respect ethical principles</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Our missions</p>
            <ul className="space-y-1 text-sm">
              <li>Join us</li>
              <li>Our eMAG</li>
              <li>Band</li>
              <li>Newsroom</li>
              <li>Action</li>
              <li>Investors</li>
              <li>Shareholders</li>
              <li>Glossary</li>
            </ul>
          </div>
        </div>

        {/* ECOSYSTEM & SOCIAL */}
        <div>
          <h3 className="uppercase font-semibold mb-4 text-white">DISCOVER OUR ENTIRE ECOSYSTEM</h3>
          <ul className="mb-6 space-y-1 text-sm">
            <li>Zettatonne Foundation</li>
            <li>The City Factory</li>
            <li>Leonard</li>
            <li>Environmental Research Lab</li>
          </ul>

          <h3 className="uppercase font-semibold mb-4 text-white">FOLLOW ZETTATONNE ON SOCIAL MEDIA</h3>
          <div className="flex space-x-4">
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e63946] text-[#e63946] font-semibold text-lg hover:bg-[#e63946] hover:text-white transition">✕</a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e63946] text-[#e63946] font-semibold text-lg hover:bg-[#e63946] hover:text-white transition">f</a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e63946] text-[#e63946] font-semibold text-lg hover:bg-[#e63946] hover:text-white transition">in</a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e63946] text-[#e63946] font-semibold text-lg hover:bg-[#e63946] hover:text-white transition">v</a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e63946] text-[#e63946] font-semibold text-lg hover:bg-[#e63946] hover:text-white transition">📷</a>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm font-semibold text-white">
        <a href="#" className="hover:text-[#e63946]">Welcome</a>
        <a href="#" className="hover:text-[#e63946]">Legal notice</a>
        <a href="#" className="hover:text-[#e63946]">Contact</a>
        <a href="#" className="hover:text-[#e63946]">Cookies</a>
        <a href="#" className="hover:text-[#e63946]">Personal data</a>
        <span>Accessibility: partially compliant</span>
      </div>
    </footer>
  );
}