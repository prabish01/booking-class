import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { prisma } from '@/lib/prisma'
import { 
  BookingStatus,
  PaymentStatus,
  Gender,
  HeardAboutUs
} from '@/generated/prisma'

// User hooks
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      return await prisma.user.findUnique({
        where: { id: userId },
        include: {
          bookings: {
            include: {
              classOccurrence: true
            }
          }
        }
      })
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (userData: {
      email: string
      username: string
      password: string
      firstName: string
      lastName: string
      phone?: string
      address: string
      dateOfBirth: Date
      gender: string
      heardAboutUs: string
    }) => {
      return await prisma.user.create({
        data: {
          ...userData,
          gender: userData.gender.toUpperCase() as Gender,
          heardAboutUs: userData.heardAboutUs.toUpperCase().replace('-', '_') as HeardAboutUs
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

// Video hooks
export const useVideos = () => {
  return useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      return await prisma.video.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' }
      })
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Class Occurrence hooks
export const useClassOccurrences = () => {
  return useQuery({
    queryKey: ['classOccurrences'],
    queryFn: async () => {
      const now = new Date()
      const twoWeeksFromNow = new Date()
      twoWeeksFromNow.setDate(now.getDate() + 14)
      
      return await prisma.classOccurrence.findMany({
        where: {
          date: {
            gte: now,
            lte: twoWeeksFromNow
          },
          isActive: true
        },
        orderBy: { date: 'asc' }
      })
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useUpcomingClasses = () => {
  return useQuery({
    queryKey: ['upcomingClasses'],
    queryFn: async () => {
      const now = new Date()
      
      return await prisma.classOccurrence.findMany({
        where: {
          date: { gte: now },
          isActive: true
        },
        orderBy: { date: 'asc' },
        take: 6 // Limit to 6 upcoming classes
      })
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Booking hooks
export const useCreateBooking = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (bookingData: {
      userId: string
      classOccurrenceId: string
      paymentAmount: number
      notes?: string
    }) => {
      return await prisma.booking.create({
        data: {
          ...bookingData,
          status: BookingStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PENDING
        },
        include: {
          user: true,
          classOccurrence: true
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['classOccurrences'] })
    }
  })
}

export const useUserBookings = (userId: string) => {
  return useQuery({
    queryKey: ['userBookings', userId],
    queryFn: async () => {
      return await prisma.booking.findMany({
        where: { userId },
        include: {
          classOccurrence: true
        },
        orderBy: { createdAt: 'desc' }
      })
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId
  })
}

// Site Settings hooks
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const settings = await prisma.siteSetting.findMany()
      // Convert to object for easier access
      return settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      }, {} as Record<string, string>)
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

// Authentication hooks (simplified - you may want to use NextAuth.js or similar)
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      // This is a simplified login - in production you'd want proper authentication
      const user = await prisma.user.findUnique({
        where: { email: credentials.email }
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      // In production, you'd verify the password hash here
      // For now, we'll just return the user
      return user
    }
  })
}
