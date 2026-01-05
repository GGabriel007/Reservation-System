import mongoose from "mongoose";

/**
 * User Schema
 * Defines the structure of user documents in the MongoDB collection.
 * Fields:
 * - email: String, unique, required
 * - password: String, optional
 * - role: String, enum of ["guest", "user", "admin"], default "guest"
 * - phoneNumber: String, optional
 * - firstName: String, optional
 * - lastName: String, optional
 * - address: Object containing:
 *    - country: String, optional
 *    - city: String, optional
 *    - zipCode: String, optional
 * - preference: Map of Strings, optional
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["guest", "user", "admin"],
    default: "guest",
  },
  loginMethod: {
    type: String,
    enum: ["none", "local", "google"],
    default: "local",
  },
  googleId: {
    type: String,
  },
  phoeneNumber: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  address: {
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    zipCode: {
      type: String,
      required: false,
    },
  },
  preference: {
    type: Map,
    of: String,
    required: false,
  },
});

export const User = mongoose.model("User", userSchema);
