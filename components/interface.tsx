"use client";

import Sidebar from '@/components/ui/sidebar';
import { GamesPanel } from '@/components/games/games-panel';
import Navbar from '@/components/ui/navbar';
import { useState } from 'react';
import { InventoryPanel } from './inventory/inventory-panel';
import { TransactionsPanel } from './transactions/transactions-panel';
import { SwapPanel } from './swapverse/swapPanel';

const Interface: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string>("");
  const [tab, setTab] = useState<any>("games");
  const [sideBar, setSideBar] = useState<any>("");

  const updateTab = (tab) => {
    console.log("tab opened ", tab)
    setTab(tab);
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar updateTab={updateTab} setUserAddress={setUserAddress} setSideBar={setSideBar} />
      <div className="flex flex-col md:flex-row flex-1">
      {/*}  <div className="hidden md:block md:w-1/5">
          <Sidebar tab={tab} setSideBar={setSideBar} />
        </div>*/}
        <div className="w-full md:w-4/5 px-4">
          {tab === "Arcade" ? (
            <GamesPanel userAddress={userAddress} />
          ) : tab === "MetaTreasures" ? (
            <InventoryPanel sideBar={sideBar} />
          ) : tab === "Metanomics" ? (
            <InventoryPanel sideBar={sideBar} />
          ) : tab === "Swapverse" ? (
            <SwapPanel />
          ) : tab === "Transactions" ? (
            <TransactionsPanel />
          ) : (
            <GamesPanel userAddress={userAddress} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Interface;
