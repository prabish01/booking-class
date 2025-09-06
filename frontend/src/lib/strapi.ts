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
  slug?: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  maxCapacity?: number;
  level?: string;
  instructor?: string;
  location: string;
  isActive?: boolean;
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
  gender?: "male" | "female" | "non-binary" | "prefer-not-to-say";
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

    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      console.error(`❌ HTTP error! status: ${response.status} for URL: ${url}`);
      console.error("Request options:", options);
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

  // Get class occurrence by slug
  async getClassOccurrenceBySlug(slug: string): Promise<StrapiResponse<ClassOccurrence>> {
    const queryParams = new URLSearchParams();
    queryParams.append("filters[slug][$eq]", slug);
    queryParams.append("populate[0]", "thumbnail");
    queryParams.append("populate[1]", "songThumbnail");

    const response = (await this.request(`/class-occurrences?${queryParams.toString()}`)) as StrapiResponse<ClassOccurrence[]>;

    // Since we're filtering, we get an array but we want the first (and should be only) item
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return {
        data: response.data[0],
        meta: response.meta,
      };
    }

    throw new Error("Class not found");
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
  async register(userData: { username: string; email: string; password: string; firstName?: string; lastName?: string; phone?: string; address?: string; dateOfBirth?: string; gender?: string; heardAboutUs?: string }): Promise<{ jwt: string; user: User }> {
    console.log("📡 Strapi register: Sending all data to registration endpoint:", userData);

    // Send all data to the registration endpoint (our custom extension will handle the additional fields)
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };

    console.log("📡 Request options being sent:", options);

    const result: { jwt: string; user: User } = await this.request("/auth/local/register", options);

    console.log("✅ Registration successful with complete user data:", result);
    return result;
  }

  // Update user profile
  async updateUserProfile(userId: string, userData: Partial<User>, token?: string): Promise<StrapiResponse<User>> {
    const headers: Record<string, string> = {};

    // Add authorization header if token is provided
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request(`/users/${userId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(userData),
    });
  }

  // Update current user profile using /users/me endpoint
  async updateCurrentUserProfile(userData: Partial<User>, token: string): Promise<User> {
    return this.request(`/users/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { identifier: string; password: string }): Promise<{ jwt: string; user: User }> {
    const result: { jwt: string; user: User } = await this.request("/auth/local", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    console.log("🔐 Login successful, fetching complete user profile...");
    console.log("🔐 Basic user data from login:", result.user);

    // Fetch the complete user profile with all fields using /users/me endpoint
    try {
      const completeUserProfile = await this.getCurrentUserProfile(result.jwt);
      console.log("✅ Complete user profile fetched:", completeUserProfile);

      return {
        ...result,
        user: completeUserProfile,
      };
    } catch (error) {
      console.warn("⚠️ Failed to fetch complete user profile, using basic data:", error);
      return result;
    }
  }

  // Get current user profile using /users/me endpoint (usually available by default)
  async getCurrentUserProfile(token: string): Promise<User> {
    return this.request(`/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Get specific user profile (requires permissions)
  async getUserProfile(userId: string, token: string): Promise<StrapiResponse<User>> {
    return this.request(`/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
