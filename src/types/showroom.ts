// तपाईंको hook संग मिल्ने types
export interface Visitor {
  id: string;
  name: string;
  avatar: string;
  joinedAt: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  type: 'text' | 'image' | 'product';
  timestamp: Date;
  isVendor: boolean;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  inStock: boolean;
  category: string;
}

export interface Vendor {
  _id: string;
  businessName: string;
  description: string;
  logo?: string;
  coverImage?: string;
  cctvUrl?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  address: string;
  storeHours: {
    open: string;
    close: string;
    daysOpen: string[];
  };
  isLive: boolean;
  products: Product[];
}