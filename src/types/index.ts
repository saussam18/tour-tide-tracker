
export interface Band {
  id: string;
  name: string;
  genre: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface Tour {
  id: string;
  bandId: string;
  bandName: string;
  dates: TourDate[];
  createdAt: Date;
}

export interface TourDate {
  id: string;
  date: Date;
  venue: string;
  city: string;
  country: string;
}
