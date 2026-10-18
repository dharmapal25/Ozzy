import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

// Handle Google login and signup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find the existing user
        let user = await User.findOne({
          googleId: profile.id,
        });

        // Create a new user if not found
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
            avatar: profile.photos?.[0]?.value,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;