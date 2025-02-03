'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { TagSelector } from '../components/TagSelector';
import { Tag, TagStore } from '../components/TagSelector/types';

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
    const selectedTagsKey = 'selected-tags';
    const loadTags = async () => {
      const storedSelectedTags = localStorage.getItem(selectedTagsKey);
      if (storedSelectedTags) {
        setSelectedTags(JSON.parse(storedSelectedTags));
      } else {
        const allTags = await tagStore.getAllTags();
        // Initial default selection of first 2 tags (only if no previous selection exists)
        setSelectedTags(allTags.slice(0, 2));
      }
    };
    loadTags();
  }, [tagStore]);

  // Save selected tags whenever they change
  useEffect(() => {
    const selectedTagsKey = 'selected-tags';
    localStorage.setItem(selectedTagsKey, JSON.stringify(selectedTags));
  }, [selectedTags]);

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
    </div>
  );
} 