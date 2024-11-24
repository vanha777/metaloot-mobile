"use client";

import React from 'react';
import { InventoryItem } from '@/components/types';
import InventoryCard from './inventory-card';
import * as fcl from "@onflow/fcl";
import { getAllItem } from '../utilities/nftStorageCheck';

export const InventoryPanel = ({ sideBar }) => {
  const [items, setItems] = React.useState<InventoryItem[] | null>(null);

  const fetchItems = async () => {
    if (sideBar === "Redeemables") {
      console.log("redemm items ")
      try {
        const items = [
          {
            id: "5",
            uuid: "voucher-005",
            description: "10% off orders under $110",
            itemName: "Discount Voucher",
            name: "10% Off Coupon",
            itemType: "Code",
            attributes: {
              // minPurchase: "$50",
              validUntil: "2024-06-30",
              region: "Worldwide"
            },
            metadata: {
              issueDate: "2023-12-01",
              terms: "Valid for standard shipping only"
            },
            thumbnail: "https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/crypto-ql/Image%2015.jpeg"
          },
        ];
        setItems(items);
      } catch (error) {
        console.error('Failed to store NFT data:', error);
      }
    } else {
      try {
        const currentUser = await fcl.currentUser.snapshot();
        if (currentUser.loggedIn && currentUser.addr) {
          const items = await getAllItem(currentUser.addr);
          console.log("all items here ...... ", items);
          setItems(items);
        }
      } catch (error) {
        console.error('Failed to store NFT data:', error);
      }
    }
  };

  React.useEffect(() => {
    fetchItems();
  }, [sideBar]);
  return (
    <>
      {items && (
        <div className="flex flex-wrap mx-2">
          {items.map((item) => (
            <div key={item.id} className="w-full sm:w-1/3 md:w-1/3  lg:w-1/3 px-2 mb-4 mt-6 ">
              <InventoryCard {...item} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
