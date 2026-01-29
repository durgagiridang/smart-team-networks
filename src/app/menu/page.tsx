"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function UserMenu() {
  const { data: session } = useSession();
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // १. मेनु आइटमहरू डेटाबेसबाट तान्ने
  useEffect(() => {
    fetch('/api/admin/menu-items')
      .then(res => res.json())
      .then(data => {
        if (data.success) setMenuItems(data.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // २. सिधै अर्डर पठाउने फङ्सन (बटन थिच्ने बित्तिकै DB मा जान्छ)
  const handleDirectOrder = async (item: any) => {
    try {
      const orderData = {
        userEmail: session?.user?.email || "walk-in@customer.com",
        items: [{
          name: item.name,
          price: item.price,
          quantity: 1
        }],
        totalAmount: item.price,
        status: "Pending", // यसले गर्दा किचन मोनिटरमा देखिन्छ
        orderType: "Dine-In"
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        alert(`${item.name} को अर्डर किचनमा पठाइयो! 👨‍🍳`);
      } else {
        const errorData = await res.json();
        alert("अर्डर फेल भयो: " + (errorData.error || "Unknown error"));
      }
    } catch (err) {
      alert("सर्भर कनेक्ट हुन सकेन।");
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <h1 className="text-3xl font-black mb-10 border-l-4 border-cyan-500 pl-4 uppercase tracking-tighter">
        Smart Menu
      </h1>
      
      {isLoading ? (
        <p className="text-gray-500 animate-pulse text-center py-20">मेनु लोड हुँदैछ...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item: any) => (
            <div key={item._id} className="bg-zinc-900 p-6 rounded-3xl border border-gray-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tighter">{item.name}</h2>
                <p className="text-cyan-400 font-black my-2 text-2xl">Rs. {item.price}</p>
                <p className="text-gray-500 text-[10px] mb-6 uppercase tracking-widest font-bold">{item.category}</p>
              </div>
              
              {/* यो बटनले अब सिधै अर्डर पठाउँछ */}
              <button 
                onClick={() => handleDirectOrder(item)}
                className="w-full bg-white text-black font-black py-3 rounded-xl hover:bg-cyan-500 hover:text-white transition-all text-xs"
              >
                ADD TO ORDER
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}