export type LibraryRequest = Partial<Omit<Library, 'name' | 'description'>> & {
  name: string;
  description: string;
};

export interface Library {
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
}

export interface LibraryNpmDetail {
  downloadsCount: number;
}
