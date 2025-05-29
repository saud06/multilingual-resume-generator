import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken as string
      session.provider = token.provider as string
      return session
    },
    async signIn({ user, account, profile }) {
      // You can add custom logic here to handle user registration
      // For now, we'll allow all sign-ins
      console.log('Sign in attempt:', { user: user.email, provider: account?.provider })
      
      // Here you could make an API call to your Laravel backend
      // to create or update the user in your database
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/social-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: account?.provider,
            provider_id: account?.providerAccountId,
            email: user.email,
            name: user.name,
            avatar: user.image,
          }),
        })
        
        if (response.ok) {
          const userData = await response.json()
          // Store user data in session or token if needed
          return true
        }
      } catch (error) {
        console.error('Error during social login:', error)
        // Continue with sign-in even if backend call fails
      }
      
      return true
    },
  },
  pages: {
    signIn: '/', // Redirect to home page for sign-in
    error: '/', // Redirect to home page on error
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log('User signed in:', user.email, 'via', account?.provider);
    },
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }
