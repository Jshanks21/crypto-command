import NextAuth from 'next-auth/next';
import { NextAuthOptions, Profile} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/prisma/client';
import { User as PrismaUser } from '@prisma/client';
import { CustomSession } from '@/utils/types';

async function getSessionUser(email: string, retryCount = 0): Promise<PrismaUser | null> {
  try {
    const sessionUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    return sessionUser;
  } catch (error) {
    if (retryCount < 3) { // Retry up to 3 times
      console.log(`Database query failed, retrying... Attempt ${retryCount + 1}`)
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds
      return getSessionUser(email, retryCount + 1);
    } else {
      console.error('Database query failed after 3 attempts', error);
      return null;
    }
  }
}

async function findOrCreateUser(profile?: Profile) {
  if (!profile?.email) return false;

  // Check if user exists in database
  const userExists = await prisma.user.findUnique({
    where: {
      email: profile?.email
    }
  })

  // If user does not exist, create user in database
  if (!userExists) {
    await prisma.user.create({
      data: {
        email: profile?.email ,
        name: profile?.name || undefined,
        image: profile?.image || undefined
      }
    })
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // TODO: Update these with new credentials for this project to replace the ones from my old project
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session }: { session: CustomSession }) {
      if (!session?.user?.email) return session;

      const sessionUser = await getSessionUser(session.user.email);
      if (sessionUser) session.user.id = sessionUser.id

      return session
    },
    async signIn({ profile }: { profile?: Profile }) {
      if (!profile?.email) return false;
      try {
        await findOrCreateUser(profile)
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };