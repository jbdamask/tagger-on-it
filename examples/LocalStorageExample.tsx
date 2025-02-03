'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { TagSelector } from '../src/components/TagSelector';
import { Tag, TagStore } from '../src/components/TagSelector/types';

// Local storage implementation of TagStore
class LocalStorageTagStore implements TagStore {
  private storageKey = 'tag-selector-tags';
  
  private getTags(): Tag[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }
  
  private saveTags(tags: Tag[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tags));
  }
  
  async searchTags(query: string): Promise<Tag[]> {
    const tags = this.getTags();
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  async createTag(name: string): Promise<Tag> {
    const tags = this.getTags();
    const newTag = { id: String(Date.now()), name };
    this.saveTags([...tags, newTag]);
    return newTag;
  }
  
  async getAllTags(): Promise<Tag[]> {
    return this.getTags();
  }
}

export default function LocalStorageExample() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagStore] = useState(() => new LocalStorageTagStore());
  
  // Load previously selected tags from localStorage
  useEffect(() => {
    const loadTags = async () => {
      const allTags = await tagStore.getAllTags();
      // For this example, we'll start with the first 2 tags selected (if they exist)
      setSelectedTags(allTags.slice(0, 2));
    };
    loadTags();
  }, [tagStore]);

  return (
    <div className="p-4">
      <h1>Persistent Tag Selector Demo</h1>
      <p className="text-sm text-gray-600 mb-4">
        Tags are stored in localStorage and persist between page reloads
      </p>
      <TagSelector
        selectedTags={selectedTags}
        tagStore={tagStore}
        onTagsChange={setSelectedTags}
      />
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Selected Tags:</h2>
        <div className="text-gray-700">
          {selectedTags.length > 0 
            ? selectedTags.map(tag => tag.name).join(', ')
            : 'No tags selected'}
        </div>
      </div>
    </div>
  );
} 