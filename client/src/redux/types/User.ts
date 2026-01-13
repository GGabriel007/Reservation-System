export type User = {
  _id: string; 
  email: string;
  firstName: string;
  lastName?: string;
  role: 'guest' | 'user' | 'manager' | 'admin';
  assignedHotel?: string; 
};