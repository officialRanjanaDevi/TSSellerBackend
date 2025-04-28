

export interface IAddress extends Document {
  addressLine1?: string;
  townORcity?: string;
  pincode?: string;
  state?: string;
  country?: string;
}

export interface IAddressUpdate {
  addressLine1?: string;
  townORcity?: string;
  pincode?: string;
  state?: string;
  country?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
}
