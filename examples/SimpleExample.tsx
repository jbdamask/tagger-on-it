'use client';

import { useState } from 'react';
import { TagSelector } from '../components/TagSelector';
import { Tag } from '../components/TagSelector/types';

// Simple in-memory tag store implementation
const simpleTagStore = {
  tags: [] as Tag[],
  
  searchTags: async (query: string) => {
    return simpleTagStore.tags.filter(tag => 
      tag.name.toLowerCase().includes(query.toLowerCase())
    );
  },
  
  createTag: async (name: string) => {
    const newTag = { id: String(Date.now()), name };
    simpleTagStore.tags.push(newTag);
    return newTag;
  },
  
  getAllTags: async () => {
    return simpleTagStore.tags;
  }
};

export default function SimpleExample() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  return (
    <div className="p-4">
      <h1>Simple Tag Selector Demo</h1>
      <TagSelector
        selectedTags={selectedTags}
        tagStore={simpleTagStore}
        onTagsChange={setSelectedTags}
      />
      <div className="mt-4">
        Selected tags: {selectedTags.map(tag => tag.name).join(', ')}
      </div>
    </div>
  );
} 