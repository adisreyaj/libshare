export interface ListRequest {
  name: string;
  description: string;
  libraries: ListLibraryData[];
  public: boolean;
}

export interface List extends ListRequest {
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListLibraryData {
  id: string;
  name: string;
  image: string;
  description: string;
}
