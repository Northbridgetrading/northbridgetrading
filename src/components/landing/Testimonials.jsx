import React from "react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "John Smith",
      role: "CEO, TechCorp",
      feedback: "Outstanding engineering services! Their team delivered our project on time and exceeded expectations.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Sarah Johnson",
      role: "Project Manager, BuildCo",
      feedback: "Highly professional and reliable. Their solutions improved our operations significantly.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "David Lee",
      role: "Operations Director, EnergyPlus",
      feedback: "Expertise, safety, and efficiency all in one. I recommend them for any large-scale project.",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg"
    },
  ];

  return (
    <section className="py-20 bg-[#f5f7f9]">
      <div className="max-w-6xl mx-auto px-6 lg:px-20">
        <h2 className="text-3xl font-semibold text-center text-[#1f3c88] mb-12">
          What Our Clients Say
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center text-center">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-16 h-16 rounded-full mb-4 object-cover"
              />
              <p className="text-gray-700 mb-4">"{t.feedback}"</p>
              <h3 className="text-[#1f3c88] font-semibold">{t.name}</h3>
              <p className="text-gray-500 text-sm">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}