'use client';

import React, { useEffect, useState } from 'react';
import { FaSignOutAlt, FaUserCircle, FaWallet } from 'react-icons/fa';
import Link from 'next/link';
import * as fcl from "@onflow/fcl";
import { onOpenUrl } from '@tauri-apps/plugin-deep-link'
// Import Flow configuration
import { addItem, mintNFT, startGame, stopGame, transferNFT, userStorageCheck } from '@/components/utilities/nftStorageCheck';
import { useUser } from '../context/UserContext';
import metaLootClient, { processUrl, User } from '../utilities/metaLootClient';
import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/core';
import WebSocket from '@tauri-apps/plugin-websocket'

const Navbar = ({ updateTab, setUserAddress,setSideBar }) => {
  const { user, setUser } = useUser();
  // possibly don't need -> only need to send Message Back
  const [ws, setWs] = useState<WebSocket | null>(null); // Store WebSocket instance 
  const [isLoading, setIsLoading] = useState(false);

  /****************************************************
   * 🎮 WEBSOCKET GAME STATE SYNCHRONIZATION 🎮
   * ==========================================
   * 
   * 🔌 Real-time connection to game server
   * 👥 Handles multiplayer interactions
   * 🎯 Manages player state updates
   * 
   * 🔗 Flow Blockchain Integration:
   * - Verifies asset ownership
   * - Secures in-game items
   * - Enables NFT minting
   ****************************************************/
  const setupWebSocket = async (address: string) => {
    try {
      const connection = await WebSocket.connect(`ws://localhost:8000/websocket/${address}`);
      setWs(connection);
      // Add message listener
      connection.addListener((msg) => {
        console.log('Received Message From WebSocket: ', msg);
        // Check if msg.data exists and is exactly "game-start"
        if (msg.data && msg.data === "game-start") {
          console.log('Game started!');
          startGame();
          // Add game start logic here
        } else if (msg.data && msg.data === "game-end") {
          console.log('Game Ended!');
          stopGame();
          // Add game end logic here
        } else {
          console.log("ELSE ......");
          let data = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
          // Add mint NFT logic here
          console.log('Item Minting ! ', data);
          const payload = data as {
            itemName: string;
            itemType: string,
            attributes: object,
            thumpNail: string
          };
          mintNFT(payload.itemName, payload.itemType, payload.attributes, payload.thumpNail);
        }
      });
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await fcl.authenticate();
      console.log("logging in...")
      setIsLoading(true);
      fcl.currentUser.subscribe(async (currentUser: User) => {
        setUser(currentUser);
        setUserAddress(currentUser.addr);
        console.log("set this to current user ", currentUser);
        if (currentUser.loggedIn) {
          setupWebSocket(currentUser.addr);
          await userStorageCheck();
        }
      });
      setIsLoading(false);
    } catch (err) {
      console.error("Authentication failed:", err);
    }
  };

  const handleLogout = () => {
    fcl.unauthenticate();
    setUser({ addr: "", loggedIn: false });
  };

  if (!user?.loggedIn) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
        <div className="flex flex-col items-center gap-6 p-8 bg-base-200 rounded-lg">
          <FaWallet className="w-16 h-16 text-primary" />
          <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
          <p className="text-center text-gray-300">Please connect your Flow wallet to continue</p>
          <button
            onClick={handleLogin}
            className="btn btn-primary btn-lg"
          >
            Connect Flow Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <nav className="navbar bg-base-200 fixed bottom-0 left-0 right-0 z-50">
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="loading loading-ring loading-lg text-secondary"></div>
            <p className="text-lg font-semibold animate-pulse text-white">Please allow apps permission on your wallet...</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-evenly w-full px-4 mb-6">
          {/* Arcade Button */}
          <button 
            onClick={() => updateTab("Arcade")} 
            className="flex flex-col items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <span className="text-xs mt-1">Arcade</span>
          </button>

          {/* MetaTreasures Button */}
          <button 
            onClick={() => updateTab("MetaTreasures")} 
            className="flex flex-col items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs mt-1">Treasures</span>
          </button>

          {/* Swapverse Button */}
          <button 
            onClick={() => updateTab("Swapverse")} 
            className="flex flex-col items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-xs mt-1">Swap</span>
          </button>

          {/* Redeemable Button */}
          <button 
            onClick={() => {
              updateTab("MetaTreasures")
              setSideBar("Redeemables")

            }} 
            className="flex flex-col items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs mt-1">Redeemable</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
