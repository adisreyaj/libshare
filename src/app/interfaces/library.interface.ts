export type LibraryRequest = Omit<Library, 'id' | 'createdAt'>;

export interface Library {
  id: string;
  name: string;
  version: string;
  description: string;
  links: LibraryLinks;
  license: string;
  github: LibraryGithubDetail;
  npm: LibraryNpmDetail;
  createdAt: string;
}

export interface LibraryLinks {
  npm: string;
  homepage: string;
  repository: string;
  bugs: string;
}

export interface LibraryGithubDetail {
  stars: number;
  forks: number;
  watchers: number;
  language: string;
  homepage: string;
  image: string;
  url: string;
}

export interface LibraryNpmDetail {
  downloadsCount: number;
}
