"use client";
import { useState } from "react";

const STNChannel = () => {
  const [liveVideoId] = useState("04z8swq1Km0"); // तपाईंको live ID
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-2 md:p-6 bg-[#0a0a0a] text-white rounded-3xl shadow-2xl border border-gray-800 my-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 italic">
            <span className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600"></span>
            </span>
            STN CHANNEL <span className="text-gray-600 not-italic">LIVE</span>
          </h2>
          <p className="text-gray-400 text-sm font-medium">नेपालको पहिलो भर्चुअल सपिङ च्यानल</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Video Player */}
        <div className="lg:col-span-3">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/5">
            {!playing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <button
                  onClick={handlePlay}
                  className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 rounded-full flex items-center gap-2 animate-pulse"
                >
                  ▶ Play STN Channel
                </button>
              </div>
            ) : (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${liveVideoId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                title="STN Live Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            )}
          </div>

          {/* Description */}
          <div className="mt-6 p-5 bg-gradient-to-r from-gray-900 to-black rounded-2xl border border-gray-800">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-red-500">#</span> बिना घरभाडा व्यापार कसरी गर्ने?
            </h3>
            <p className="text-gray-400 mt-3 leading-relaxed font-light">
              अहिले हामीसँग <span className="text-white font-semibold underline decoration-red-500">लक्ष्मी फेसन बुटिक</span> जोडिनुभएको छ। उहाँले आफ्नो घरको कोठाबाटै सीसीटीभी मार्फत देशभरिका ग्राहकलाई लाइभ सामान देखाइरहनुभएको छ।
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Featured Shop */}
          <div className="bg-[#151515] p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
            <span className="text-[10px] bg-white text-black font-black px-2 py-0.5 rounded-sm uppercase tracking-widest">Featured</span>
            <div className="mt-5 text-center">
              <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full mb-4 border-4 border-white/5 overflow-hidden ring-2 ring-red-600/20">
                <img src="https://via.placeholder.com/150" alt="Vendor" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-black text-xl tracking-tight">लक्ष्मी फेसन बुटिक</h4>
              <p className="text-xs text-gray-500 font-medium mb-5 uppercase tracking-tighter">बनेपा-८, काभ्रे</p>
              <button className="w-full bg-white text-black font-black py-3 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 transform active:scale-95 shadow-xl">
                लाइभ पसल हेर्नुहोस् 🛍️
              </button>
            </div>
          </div>

          {/* Live Activity */}
          <div className="flex-1 bg-[#0f0f0f] rounded-2xl p-4 border border-gray-800 flex flex-col min-h-[250px]">
            <h5 className="text-xs font-black mb-4 flex items-center gap-2 text-gray-500 tracking-widest">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              LIVE ACTIVITY
            </h5>
            <div className="flex-1 overflow-y-auto space-y-4 text-[13px] pr-2 scrollbar-hide">
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 font-bold text-[10px] uppercase">Rider 045 • १ मिनेट अघि</span>
                <p className="bg-white/5 p-2 rounded-lg border-l-2 border-red-600 italic">"राइडरको लागि मासिक २५०० एकदम राम्रो अफर हो!"</p>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-gray-500 font-bold text-[10px] uppercase">User_99 • अहिले</span>
                <p className="bg-red-600/10 p-2 rounded-lg border-r-2 border-red-600">"यो लुगाको प्राइस कति हो म्याम?"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default STNChannel;