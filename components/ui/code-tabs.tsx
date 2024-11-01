import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IconMarkdown, IconChevronRight, IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface CodeTabsProps {
  tabs: Tab[];
  className?: string;
}

export const CodeTabs: React.FC<CodeTabsProps> = ({ tabs, className }) => {
  const [activeTabs, setActiveTabs] = useState<string[]>([tabs[0].id]);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  const handleTabClick = (tabId: string) => {
    if (!activeTabs.includes(tabId)) {
      setActiveTabs([...activeTabs, tabId]);
    }
    setActiveTab(tabId);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newActiveTabs = activeTabs.filter(id => id !== tabId);
    if (newActiveTabs.length === 0) {
      newActiveTabs.push(tabs[0].id);
    }
    if (activeTab === tabId) {
      setActiveTab(newActiveTabs[newActiveTabs.length - 1]);
    }
    setActiveTabs(newActiveTabs);
  };

  return (
    <div className={cn("rounded-lg overflow-hidden border border-neutral-800 bg-black shadow-2xl", className)}>
      <div className="flex">
        {/* File Tree */}
        <div className="w-48 border-r border-neutral-800 bg-neutral-900/50 p-2">
          <div className="flex items-center gap-2 text-xs text-neutral-400 px-2 py-1">
            <span className="font-mono">FEATURES</span>
          </div>
          <div className="mt-2">
            {tabs.map(tab => (
              <div
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer font-mono",
                  activeTab === tab.id 
                    ? "bg-neutral-800/50 text-white" 
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/20"
                )}
              >
                <IconChevronRight 
                  size={14} 
                  className={cn(
                    "transition-transform",
                    activeTab === tab.id ? "rotate-90" : ""
                  )}
                />
                <IconMarkdown size={14} />
                {tab.title}
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 bg-black">
          {/* Tabs Bar */}
          <div className="flex items-center border-b border-neutral-800 bg-neutral-900/50">
            <div className="flex-1 flex">
              {activeTabs.map(tabId => {
                const tab = tabs.find(t => t.id === tabId)!;
                return (
                  <motion.div
                    key={tab.id}
                    layoutId={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm border-r border-neutral-800 cursor-pointer group font-mono",
                      activeTab === tab.id 
                        ? "bg-black text-white" 
                        : "bg-neutral-900/50 text-neutral-400 hover:text-neutral-200"
                    )}
                  >
                    <IconMarkdown size={14} />
                    {tab.title}
                    <button
                      onClick={(e) => closeTab(tab.id, e)}
                      className="opacity-0 group-hover:opacity-100 hover:bg-neutral-700 rounded p-0.5 transition-opacity"
                    >
                      <IconX size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="relative h-[600px] overflow-y-auto">
            {tabs.map(tab => (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: activeTab === tab.id ? 1 : 0,
                  y: activeTab === tab.id ? 0 : 10,
                  pointerEvents: activeTab === tab.id ? 'auto' : 'none',
                  position: 'absolute',
                  inset: 0,
                }}
                transition={{ duration: 0.2 }}
                className="p-6 font-mono text-neutral-200"
              >
                {tab.content}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeTabs;