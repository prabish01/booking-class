const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path?: string;
  width?: number;
  height?: number;
  size: number;
  url: string;
}

export interface Media extends StrapiEntity {
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: Record<string, unknown>;
}

export interface Video extends StrapiEntity {
  title: string;
  description?: string;
  thumbnail: Media;
  externalUrl: string;
  videoFile?: Media;
  featured: boolean;
}

export interface ClassOccurrence extends StrapiEntity {
  title: string;
  description?: string;
  date: string;
  durationMinutes: number;
  location: string;
  thumbnail: Media;
  songThumbnail?: Media;
  spotsAvailable?: number;
  price: number;
  externalVideoIds?: Video[];
}

export interface User extends StrapiEntity {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  heardAboutUs?: string;
  phone?: string;
  profilePicture?: Media;
}

export interface Booking extends StrapiEntity {
  user?: User;
  classOccurrence: ClassOccurrence;
  status: "pending" | "confirmed" | "canceled" | "refunded";
  amountPaidCents: number;
  currency: string;
  stripePaymentIntentId?: string;
  guestFirstName?: string;
  guestLastName?: string;
  guestEmail?: string;
}

// For creating bookings, relations are passed as IDs
export interface CreateBookingData {
  user?: number;
  classOccurrence: number;
  status: "pending" | "confirmed" | "canceled" | "refunded";
  amountPaidCents: number;
  currency: string;
  stripePaymentIntentId?: string;
  guestFirstName?: string;
  guestLastName?: string;
  guestEmail?: string;
}

export interface SiteSettings extends StrapiEntity {
  logo: Media;
  headerLogo: Media;
  headerVideo?: Media;
  heroTitle: string;
  heroSubtitle?: string;
  socials?: Array<{
    platform: string;
    url: string;
  }>;
}

class StrapiAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = STRAPI_URL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}/api${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Videos
  async getVideos(params?: { featured?: boolean }): Promise<StrapiResponse<Video[]>> {
    const queryParams = new URLSearchParams();
    if (params?.featured) {
      queryParams.append("filters[featured][$eq]", "true");
    }
    queryParams.append("populate", "thumbnail,videoFile");

    return this.request(`/videos?${queryParams.toString()}`);
  }

  async getVideo(id: string): Promise<StrapiResponse<Video>> {
    return this.request(`/videos/${id}?populate=thumbnail,videoFile`);
  }

  // Class Occurrences
  async getClassOccurrences(params?: { startDate?: string; endDate?: string }): Promise<StrapiResponse<ClassOccurrence[]>> {
    const queryParams = new URLSearchParams();

    // Add date filters using Strapi v5 syntax
    if (params?.startDate) {
      queryParams.append("filters[date][$gte]", params.startDate);
    }
    if (params?.endDate) {
      queryParams.append("filters[date][$lte]", params.endDate);
    }

    // Add populate using correct Strapi v5 syntax
    queryParams.append("populate[0]", "thumbnail");
    queryParams.append("populate[1]", "songThumbnail");

    // Add sorting
    queryParams.append("sort[0]", "date:asc");

    return this.request(`/class-occurrences?${queryParams.toString()}`);
  }

  async getClassOccurrence(id: string): Promise<StrapiResponse<ClassOccurrence>> {
    return this.request(`/class-occurrences/${id}?populate[0]=thumbnail&populate[1]=songThumbnail`);
  }

  // Create class occurrence
  async createClassOccurrence(data: Partial<ClassOccurrence>): Promise<StrapiResponse<ClassOccurrence>> {
    return this.request("/class-occurrences", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  }

  // Update class occurrence
  async updateClassOccurrence(id: string, data: Partial<ClassOccurrence>): Promise<StrapiResponse<ClassOccurrence>> {
    return this.request(`/class-occurrences/${id}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
    });
  }

  // Delete class occurrence
  async deleteClassOccurrence(id: string): Promise<void> {
    return this.request(`/class-occurrences/${id}`, {
      method: "DELETE",
    });
  }

  // Bookings
  async createBooking(data: CreateBookingData): Promise<StrapiResponse<Booking>> {
    return this.request("/bookings", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  }

  async getBookings(userId?: string): Promise<StrapiResponse<Booking[]>> {
    const queryParams = new URLSearchParams();
    if (userId) {
      queryParams.append("filters[user][id][$eq]", userId);
    }
    queryParams.append("populate", "classOccurrence.thumbnail,user");

    return this.request(`/bookings?${queryParams.toString()}`);
  }

  // Site Settings
  async getSiteSettings(): Promise<StrapiResponse<SiteSettings>> {
    return this.request("/site-setting?populate=logo,headerLogo,headerVideo");
  }

  // Auth
  async register(userData: { username: string; email: string; password: string; firstName?: string; lastName?: string }): Promise<{ jwt: string; user: User }> {
    // Only send required fields for initial registration
    const registrationData = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    };

    const result: { jwt: string; user: User } = await this.request("/auth/local/register", {
      method: "POST",
      body: JSON.stringify(registrationData),
    });

    // If we have additional fields, update the user profile after registration
    if (userData.firstName || userData.lastName) {
      try {
        await this.updateUserProfile(result.user.id.toString(), {
          firstName: userData.firstName,
          lastName: userData.lastName,
        });
      } catch (error) {
        console.warn("Failed to update user profile after registration:", error);
        // Don't fail the registration if profile update fails
      }
    }

    return result;
  }

  // Update user profile
  async updateUserProfile(userId: string, userData: Partial<User>): Promise<StrapiResponse<User>> {
    return this.request(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { identifier: string; password: string }): Promise<{ jwt: string; user: User }> {
    return this.request("/auth/local", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }
}

export const strapiAPI = new StrapiAPI();

export function getStrapiMediaURL(url: string): string {
  if (url.startsWith("http")) {
    return url;
  }
  return `${STRAPI_URL}${url}`;
}
