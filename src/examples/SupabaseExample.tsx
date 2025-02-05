'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TagSelector } from '../components/TagSelector/TagSelector';
import { Tag, TagStore } from '../components/TagSelector/types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase implementation of TagStore
class SupabaseTagStore implements TagStore {
  constructor(private userId: string) {}

  async getAllTags(limit?: number): Promise<Tag[]> {
    let query = supabase
      .from('user_tags')
      .select('tag_id, tag_name')
      .eq('user_id', this.userId);
    
    if (limit) {
      // Request one extra item to determine if there are more
      query = query.limit(limit + 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tags:', error);
      return [];
    }

    // Notice we don't truncate the returned dict. This is because we need to 
    // know if there are more tags in the database than what the UI will show.
    return data
      .map(tag => ({
        id: tag.tag_id,
        name: tag.tag_name,
      }))
  }

  async searchTags(query: string): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('user_tags')
      .select('tag_id, tag_name')
      .eq('user_id', this.userId)
      .ilike('tag_name', `%${query}%`);

    if (error) {
      console.error('Error searching tags:', error);
      return [];
    }

    return data.map(tag => ({
      id: tag.tag_id,
      name: tag.tag_name,
    }));
  }

  async createTag(name: string): Promise<Tag> {
    // First check if the tag already exists for this user
    const { data: existingTags } = await supabase
      .from('user_tags')
      .select('tag_id, tag_name')
      .eq('user_id', this.userId)
      .ilike('tag_name', name)
      .limit(1);

    if (existingTags && existingTags.length > 0) {
      return {
        id: existingTags[0].tag_id,
        name: existingTags[0].tag_name,
      };
    }

    // If tag doesn't exist, create a new one
    const { data, error } = await supabase
      .from('user_tags')
      .insert([
        {
          user_id: this.userId,
          tag_name: name,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating tag:', error);
      throw new Error('Failed to create tag');
    }

    return {
      id: data.tag_id,
      name: data.tag_name,
    };
  }
}

export default function SupabaseExample() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function initializeUser() {
      try {
        // First try to find existing user
        const { data: existingUser } = await supabase
          .from('users')
          .select()
          .eq('username', 'example_user')
          .single();

        if (existingUser) {
          setUserId(existingUser.id);
          // Don't set any selected tags initially
          setSelectedTags([]);
          return;
        }

        // If no user exists, create new one
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert([{ username: 'example_user' }])
          .select()
          .single();

        if (userError || !newUser) {
          throw new Error(userError?.message || 'Failed to initialize user');
        }

        setUserId(newUser.id);
        // Don't set any selected tags initially
        setSelectedTags([]);
      } catch (error) {
        console.error('Error initializing user:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    initializeUser();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1>Supabase Tag Selector Demo</h1>
      <p className="mb-4">This example shows how tags are stored in Supabase</p>
      
      <div className="border p-4 rounded-lg">
        <TagSelector
          selectedTags={selectedTags}
          tagStore={new SupabaseTagStore(userId)}
          onTagsChange={setSelectedTags}
        />
      </div>
    </div>
  );
} 