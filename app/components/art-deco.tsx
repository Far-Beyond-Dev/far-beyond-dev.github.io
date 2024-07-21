import React from 'react';
import { FlipWords } from './flip-words';

export function FlipWordsArtDeco() {
  const words = ['Game-Server', 'MMO', 'Anti-Cheat', 'Game-Chat', 'Authentication', 'Community', 'Analytics',
    'Machine-Learning', 'Monitoring', 'NPCs', 'AIs', 'Match-Making', 'Economy', 'Physics', 'Achievements',
    'Replay-System', 'Guilds', 'Inventory', 'Leaderboards', 'Quests', 'Raids', 'Crafting', 'Trading', 'PVP',
    'PVE', 'Loot', 'Skills', 'Abilities', 'Mounts', 'Pets', 'Housing', 'Dungeons', 'Arenas',
    'Tournaments', 'Auctions', 'Professions', 'Events', 'Rewards', 'Factions',
    'Challenges', 'Exploration', 'Progression', 'Customization', 'Emotes', 'Voice-Chat', 'Friend-List',
    'Party-System', 'Raid-Planner', 'Guild-Bank', 'Item-Mall', 'Microtransactions', 'Subscriptions', 'Server-Status',
    'Server-Logs', 'Admin-Tools', 'Player-Stats', 'Server-Rules', 'Game-Patches', 'Bug-Reports', 'Server-Backups'];

  return (
    <div className="h-[10rem] flex justify-center items-center px-4">
      <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
        <div className="text-center text-5xl font-bold relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-neutral-500 py-8">
          Run your<FlipWords words={words} />on Horizon
        </div>
      </div>
    </div>
  );
}
