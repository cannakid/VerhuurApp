export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export default interface Appliance {
  id: string;
  userId: string;
  ownerName: string;
  description: string;
  category: string;
  url: string;
  price: number;
  available: boolean;
  personalAvailable: boolean;
  location: GeoLocation | null;
}
