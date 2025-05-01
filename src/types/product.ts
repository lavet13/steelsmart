export interface ProductReview {
  id: string
  author: string
  rating: number
  comment: string
  date: string
}

export interface ProductSpecification {
  name: string
  value: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

export interface Product {
  id: string
  slug: string
  name: string
  category: string
  subcategory?: string
  brand: string
  model: string
  sku: string
  price: number
  oldPrice?: number
  discount?: number
  cashback?: number
  stock: number
  rating: number
  reviewCount: number
  description: string
  shortDescription?: string
  specifications: ProductSpecification[]
  images: ProductImage[]
  features?: string[]
  isNew?: boolean
  isBestseller?: boolean
  isRecommended?: boolean
  reviews?: ProductReview[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  subtotal: number
  discount: number
  total: number
}

