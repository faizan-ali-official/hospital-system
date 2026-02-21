import React, { useState } from "react";
import CheckupSlip from "../components/slipTypes/checkupSlip";
import PharmacySlip from "../components/slipTypes/pharmacySlip";
import { HiDocumentText, HiCube } from "react-icons/hi2";

const TABS = [
  { id: "appointment", label: "Appointment Slip", Icon: HiDocumentText },
  { id: "pharmacy", label: "Pharmacy Slip", Icon: HiCube },
];

function Home() {
  const [activeTab, setActiveTab] = useState("appointment");

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/50 overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/60">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-[#004aa3] bg-white border-b-2 border-[#004aa3] shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/80"
              }`}
            >
              <tab.Icon className="w-5 h-5 flex-shrink-0" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form content - compact so form + Generate fit without scrolling */}
        <div className="p-4 sm:p-5">
          {activeTab === "appointment" ? <CheckupSlip /> : <PharmacySlip />}
        </div>
      </div>
    </div>
  );
}

export default Home;
