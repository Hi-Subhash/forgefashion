
export interface Product {
  id: number | string;
  name: string;
  price?: string;
  imageUrl: string;
  category: string;
}

export type View = 'shop' | 'customize' | 'gallery';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}
