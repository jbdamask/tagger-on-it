'use client';

import React, { useState } from 'react';
import { TagSelector } from '../components/TagSelector/TagSelector';
import { Tag, TagStore } from '../components/TagSelector/types';

// Internal type for the store implementation
interface UserTag extends Tag {
  userId: string;
}

// Create a single source of tags in memory
const tagsList: UserTag[] = [];

// Example implementation of base TagStore with persistent tag lists
class LocalStorageTagStore implements TagStore {
  constructor(private userId: string) {}

  async getAllTags(): Promise<Tag[]> {
    return tagsList
      .filter(tag => tag.userId === this.userId)
      .map(({userId, ...tag}) => tag);
  }

  async searchTags(query: string): Promise<Tag[]> {
    const lowercaseQuery = query.toLowerCase();
    return tagsList
      .filter(tag => 
        tag.userId === this.userId && 
        tag.name.toLowerCase().includes(lowercaseQuery)
      )
      .map(({userId, ...tag}) => tag);
  }

  async createTag(name: string): Promise<Tag> {
    // Check if tag already exists for this user
    const existingTag = tagsList.find(tag => 
      tag.userId === this.userId && 
      tag.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingTag) {
      const {userId, ...tag} = existingTag;
      return tag;
    }

    const newTag: UserTag = {
      id: crypto.randomUUID(),
      name,
      userId: this.userId
    };

    tagsList.push(newTag);
    return {id: newTag.id, name: newTag.name};
  }
}

export default function MultiTenantExample() {
  const [user1Tags, setUser1Tags] = useState<Tag[]>([]);
  const [user2Tags, setUser2Tags] = useState<Tag[]>([]);
  
  // Create two different stores with different userIds
  const user1Store = new LocalStorageTagStore("user1");
  const user2Store = new LocalStorageTagStore("user2");

  return (
    <div className="p-4">
      <h1>Multi-tenant Tag Selector Demo</h1>
      <p className="mb-4">This example shows how tags are separated by user</p>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">User 1's Tags</h2>
          <TagSelector
            selectedTags={user1Tags}
            tagStore={user1Store}
            onTagsChange={setUser1Tags}
          />
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">User 2's Tags</h2>
          <TagSelector
            selectedTags={user2Tags}
            tagStore={user2Store}
            onTagsChange={setUser2Tags}
          />
        </div>
      </div>
    </div>
  );
} 