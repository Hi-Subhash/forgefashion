
export interface Product {
  id: number | string;
  name: string;
  price?: string;
  imageUrl: string;
  category: string;
}

export type View = 'shop' | 'customize' | 'gallery';