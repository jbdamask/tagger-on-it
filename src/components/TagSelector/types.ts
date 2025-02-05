export interface Tag {
  id: string;
  name: string;
}

export interface TagStore {
  searchTags: (query: string) => Promise<Tag[]>;
  createTag: (name: string) => Promise<Tag>;
  getAllTags: (limit?: number) => Promise<Tag[]>;
} 