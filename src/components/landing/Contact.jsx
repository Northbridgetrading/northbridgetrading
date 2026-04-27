import React from "react";

export default function Contact() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-20">
        <h2 className="text-3xl font-semibold text-center text-[#1f3c88] mb-12">
          Get in Touch
        </h2>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Info */}
          <div className="lg:w-1/2 flex flex-col justify-center gap-6">
            <h3 className="text-2xl font-semibold text-[#1f3c88]">Contact Information</h3>
            <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
            <p className="text-gray-700">Email: info@yourcompany.com</p>
            <p className="text-gray-700">Address: 123 Engineering Lane, City, Country</p>
          </div>

          {/* Contact Form */}
          <div className="lg:w-1/2">
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f3c88]"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f3c88]"
              />
              <textarea
                placeholder="Your Message"
                rows="5"
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f3c88]"
              />
              <button
                type="submit"
                className="bg-[#1f3c88] text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}