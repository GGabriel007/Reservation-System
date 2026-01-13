export type Room = {
  _id: string;
  roomName: string;
  roomType: string;
  roomDescription: string;
  basePrice: number;
  maxOccupancy: number;
  amenities: string[];
  availabilityStatus: string;
  images: string[];
  hotel: string;
};
