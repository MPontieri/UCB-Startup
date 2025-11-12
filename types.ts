export interface User {
  id: number;
  username: string;
  password?: string;
}

export interface Bid {
  userId: number;
  username: string;
  amount: number;
  date: Date;
}

export interface AuctionItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  currentBid: number;
  endDate: Date;
  ownerId: number;
  bids: number;
  bidderIds: number[];
  bidHistory: Bid[];
  paid?: boolean;
}

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};