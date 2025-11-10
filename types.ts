
export interface Design {
  id: string;
  title: string;
  imageUrl: string;
  categoryId: string;
  isFeatured: boolean;
}

export interface Category {
  id: string;
  name: string;
}
