'use client';

import { useState } from 'react';
import { TagSelector } from '../components/TagSelector';
import { Tag, TagStore } from '../components/TagSelector/types';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated remote tag store with artificial delay
class AsyncTagStore implements TagStore {
  private tags: Tag[] = [
    { id: '1', name: 'React' },
    { id: '2', name: 'TypeScript' },
    { id: '3', name: 'JavaScript' },
    { id: '4', name: 'CSS' },
    { id: '5', name: 'HTML' },
  ];
  
  async searchTags(query: string): Promise<Tag[]> {
    // Simulate API delay
    await delay(500);
    
    return this.tags.filter(tag => 
      tag.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  async createTag(name: string): Promise<Tag> {
    // Simulate API delay
    await delay(1000);
    
    const newTag = { id: String(Date.now()), name };
    this.tags.push(newTag);
    return newTag;
  }
  
  async getAllTags(): Promise<Tag[]> {
    // Simulate API delay
    await delay(300);
    return this.tags;
  }
}

export default function AsyncExample() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagStore] = useState(() => new AsyncTagStore());

  return (
    <div className="p-4">
      <h1>Async Tag Selector Demo</h1>
      <p className="text-sm text-gray-600 mb-4">
        This example simulates API delays to demonstrate loading states
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