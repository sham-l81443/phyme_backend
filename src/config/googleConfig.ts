import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const googleConfig = () => {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      console.log(profile)
      try {

        console.log('Authentication successful', {
          profile: profile.id,
          email: profile.emails?.[0]?.value
        });


        return done(null, profile);
      } catch (error) {
        return done(error, false);
      }
    }
  ));

};

export default googleConfig;