"use client";

import { useState, ReactNode, useRef, useEffect } from "react";

export interface TabItem {
  id: string | number;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string | number;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTabId }) => {
  const [activeTab, setActiveTab] = useState<string | number>(
    defaultTabId || tabs[0].id
  );
  const [underlineStyle, setUnderlineStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const index = tabs.findIndex((t) => t.id === activeTab);
    const tabEl = tabsRef.current[index];
    if (tabEl) {
      setUnderlineStyle({ left: tabEl.offsetLeft, width: tabEl.offsetWidth });
    }
  }, [activeTab, tabs]);

  return (
    <div className="w-full">
      <div className="relative border-b-[0.5px] border-gray-300">
        <div className="flex overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => (tabsRef.current[index] = el)}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 whitespace-nowrap text-sm font-medium transition-colors duration-200
    ${
      activeTab === tab.id
        ? "text-success font-semibold"
        : "text-gray-400 hover:text-gray-500"
    }`}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}

          {/* underline */}
          <div
            className="absolute bottom-0 h-0.5 bg-success-light transition-all duration-300"
            style={{ left: underlineStyle.left, width: underlineStyle.width }}
          />
        </div>
      </div>

      <div className="p-4">
        {tabs.map(
          (tab) => activeTab === tab.id && <div key={tab.id}>{tab.content}</div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
