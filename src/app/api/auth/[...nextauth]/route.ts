import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { Account, User as AuthUser } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google"

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {type: 'text'},
        password: {type: 'password'}
      },

      async authorize(credentials: any) {

        try {
          await connectMongoDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    })
  ],
  callbacks: {
    async signIn({ user, account}: { user: AuthUser; account: Account }) {
      if (account.provider == "credentials") {
        return true;
      }
      if (account.provider == "google") {
        await connectMongoDB();
        try {
          const existingUser = await User.findOne({ email: user.email});
          console.log("existing user", existingUser)
          if(!existingUser) {
            const newUser = new User({
              email: user.email,
              name: user.name,
            });

            await newUser.save();
            return true;
          }
          return true;
        } catch(err) {
          console.log("error saving user", err);
          return false
        }
      }
    }
  },
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
