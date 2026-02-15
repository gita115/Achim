/**
 * Shared domain types for the Achim frontend.
 */

export interface User {
    id: number
    name: string
    email: string
    role: string
    organizationId: number
    active: boolean
  }
  
  export interface AuthUser extends User {
    token: string
  }
  
  export interface Image {
    id: number
    title: string
    description: string
    categoryId: number
    category?: Category
    photographer: string
    year: number
    filePath: string
    thumbnailPath: string
    isActive: boolean
    price: number
    tags?: Tag[]
  }
  
  export interface Category {
    id: number
    name: string
    parentCategoryId?: number | null
  }
  
  export interface Tag {
    id: number
    name: string
  }
  
  export interface Purchase {
    id: number
    userId: number
    imageId: number
    amount: number
    purchaseDate: string
    paymentStatus: string
    image?: Image
  }
  
  export interface Organization {
    id: number
    name: string
  }
  
  export interface LoginRequest {
    email: string
    password: string
  }
  
  export interface RegisterRequest {
    name: string
    email: string
    password: string
    organizationId: number
  }
  
  export interface CatalogFilters {
    categoryId?: number
    tagIds?: number[]
    search?: string
    minPrice?: number
    maxPrice?: number
  }
  
  /** User role literals for guards */
  export const ROLES = {
    Admin: "Admin",
    User: "User",
  } as const
  
  export type Role = (typeof ROLES)[keyof typeof ROLES]
  