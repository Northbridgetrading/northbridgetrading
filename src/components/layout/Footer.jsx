import React from "react";
import { FaXTwitter, FaInstagram, FaLinkedinIn, FaTiktok, FaYoutube } from "react-icons/fa6";

const productLinks = ["Invest", "Predict", "Strategies", "Retirement", "Gold", "Crypto", "Wallet", "Connect", "API", "Legend", "Options", "Futures"];
const companyLinks = ["About us", "Blog", "Partner With Us", "Affiliates", "Press", "Careers", "Investor Relations", "Support", "ESG", "Investor Index", "Northbridge Merch"];
const legalLinks = ["Terms & Conditions", "Disclosures", "Privacy Statement", "Web Visitor Privacy", "Law Enforcement Requests", "Your Privacy Choices"];
const bottomLinks = ["Welcome", "Legal notice", "Contact", "Cookies", "Personal data"];

export default function Footer() {
  return (
    <footer className="bg-[#060d18] text-white">

      {/* TOP BAR */}
      <div className="border-b border-white/10 py-4 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-[13px] text-white/50">
            <a href="#" className="hover:text-white transition">Customer Relationship Summaries</a>
            <span className="opacity-30">|</span>
            <a href="#" className="hover:text-white transition">FINRA BrokerCheck</a>
          </div>
          <div className="flex items-center gap-3 text-[13px] text-white/50">
            <span>Follow us on</span>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:border-[#1E4A7C] hover:text-white transition">
              <FaXTwitter size={14} />
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:border-[#1E4A7C] hover:text-white transition">
              <FaInstagram size={14} />
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:border-[#1E4A7C] hover:text-white transition">
              <FaLinkedinIn size={14} />
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:border-[#1E4A7C] hover:text-white transition">
              <FaTiktok size={14} />
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:border-[#1E4A7C] hover:text-white transition">
              <FaYoutube size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* COL 1 — Product */}
        <div>
          <h3 className="text-[13px] font-semibold text-white mb-5 tracking-wide">Product</h3>
          <ul className="space-y-3 text-[14px] text-white/60">
            {productLinks.map((item) => (
              <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* COL 2 — Company */}
        <div>
          <h3 className="text-[13px] font-semibold text-white mb-5 tracking-wide">Company</h3>
          <ul className="space-y-3 text-[14px] text-white/60">
            {companyLinks.map((item) => (
              <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* COL 3 — Legal */}
        <div>
          <h3 className="text-[13px] font-semibold text-white mb-5 tracking-wide">Legal & Regulatory</h3>
          <ul className="space-y-3 text-[14px] text-white/60">
            {legalLinks.map((item) => (
              <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* COL 4 — Disclaimer */}
        <div>
          <p className="text-[13px] font-semibold text-white mb-4">All investing involves risk.</p>
          <p className="text-[12.5px] text-white/50 leading-relaxed mb-4">
            <span className="font-semibold text-white/70">Brokerage services</span> are offered through Northbridge Financial LLC, a registered broker dealer, and clearing services through Northbridge Securities, LLC.
          </p>
          <p className="text-[12.5px] text-white/50 leading-relaxed mb-4">
            <span className="font-semibold text-white/70">Portfolio Management</span> offered through Northbridge Asset Management, LLC, an SEC-registered investment advisor.
          </p>
          <p className="text-[12.5px] text-white/50 leading-relaxed">
            <span className="font-semibold text-white/70">Cryptocurrency services</span> are offered through Northbridge Crypto, LLC. Licensed to engage in virtual currency business activity.
          </p>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 py-6 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-white/40">
          <p>2026 Northbridge Trading. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            {bottomLinks.map((item) => (
              <a key={item} href="#" className="hover:text-white transition">{item}</a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}