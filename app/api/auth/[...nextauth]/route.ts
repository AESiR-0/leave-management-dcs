import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace with your own authentication logic
        const { username, password } = credentials ?? {};

        // Example: Validate against a database or API
        const user = await fetch(`${process.env.AUTH_API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }).then((res) => res.json());

        if (user && user.id) {
          return user; // Return user object if authentication is successful
        } else {
          return null; // Return null if authentication fails
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token; // Attach the token data to the session object
      return session;
    },
  },
});

export { handler as GET, handler as POST };
