import { User } from './user.interface';
import { Library } from './library.interface';

export interface ListRequestBase {
  name: string;
  description: string;

  public: boolean;
}

export interface ListRequest extends ListRequestBase {
  libraries: ListLibraryData[];
}

export interface List extends ListRequest {
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListPublic extends ListRequestBase {
  libraries: Library[];
  user: User;
}

export interface ListLibraryData {
  id: string;
  name: string;
  image: string;
  description: string;
}
