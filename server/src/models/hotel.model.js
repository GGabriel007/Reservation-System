import mongoose from "mongoose";

/**
 * Hotel Schema
 * Defines the structure of hotel documents in the MongoDB collection.
 * Supports multiple locations and soft deletion.
 * * Fields:
 * - name: Name of the hotel (String, required)
 * - address: Structured location including street, city, state, and zip (Object, required)
 * - description: Detailed text about the property (String, optional)
 * - images: URLs for property photos (Array of Strings, optional)
 * - isDeleted: Soft delete flag to hide hotel without losing data (Boolean, default: false)
 * - timestamps: Automatically tracks createdAt and updatedAt
 */
const HotelSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: "USA" }
  },

  description: { 
    type: String, 
    required: false // Useful for the Hotel Details page
  },

  // Supporting multiple images for the industry-grade UI
  images: { 
    type: [String], 
    required: false 
  },

  // --- BUSINESS LOGIC ---
  
  // SOFT DELETE: Requirement from your checklist
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { 
  // Automatically adds 'createdAt' and 'updatedAt'
  timestamps: true 
});

/**
 * SOFT DELETION MIDDLEWARE
 * This automatically filters out hotels marked as 'isDeleted'
 * so they don't show up in your "Listing" or "Search" results.
 */
HotelSchema.pre(/^find/, function() {
  this.where({ isDeleted: { $ne: true } });
});

export const Hotel = mongoose.model("Hotel", HotelSchema);