const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require('../models/user');

// Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, 
async (accessToken, refreshToken, profile, done) => {
    try 
    {
        // Extract properties
        const gid = profile?.id;
        const firstName = profile?.name?.givenName || "";
        const lastName  = profile?.name?.familyName || "";
        const name = `${firstName} ${lastName}`.trim();
        const email = profile?.emails?.[0]?.value;
        const username = email;

        // If user already exist in database
        const existingUser = await User.findOne({ $or:[{ gid:gid }, { email:email }] });
        if(existingUser) return done(null, existingUser);
    
        // Prepare payload
        const payload = { gid, name, email, username, password:`GoogleAccount:${gid}`, status:"Approved" };

        // Create new user
        const createUser = await User.create(payload);
        return done(null, createUser);
    } 
    catch(error) 
    {
        return done(error, null);
    }
}));

// Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ["id", "displayName", "emails"]
}, 
async (accessToken, refreshToken, profile, done) => {
    try 
    {
        // Extract properties
        const fid = profile?.id;
        const name = profile?.displayName;
        const email = profile?.emails?.[0]?.value;
        const username = email;

        // Check if user already exists
        const existingUser = await User.findOne({ $or:[{ fid:fid }, { email:email }] });
        if(existingUser) return done(null, existingUser);

        // Prepare payload
        const payload = { fid, name, email, username, password:`FacebookAccount:${fid}`, status:"Approved" };        

        // Create new user
        const createUser = await User.create(payload);
        return done(null, createUser);
    } 
    catch(error) 
    {
        return done(error, null);
    }
}));