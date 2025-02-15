import React, { useState, useRef, useEffect } from 'react';
import { Tag, TagStore } from './types';
import styles from './TagSelector.module.css';
import { TagIcon, XMarkIcon } from './icons';

export const TagSelector = ({
  selectedTags,
  tagStore,
  onTagsChange,
  className,
  maxSuggestions = 15
}: {
  selectedTags: Tag[];
  tagStore: TagStore;
  onTagsChange: (tags: Tag[]) => void;
  className?: string;
  maxSuggestions?: number;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSelectingTag = useRef(false);

  useEffect(() => {
    const loadAllTags = async () => {
      const tags = await tagStore.getAllTags(maxSuggestions);
      if (!tags || tags.length === 0) {
        return;
      }
      const sortedTags = tags.sort((a, b) => a.name.localeCompare(b.name));
      setAllTags(sortedTags);
    };
    loadAllTags();
  }, [tagStore, maxSuggestions]);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      const suggestedTags = await tagStore.searchTags(value);
      setSuggestions(suggestedTags.filter(tag => 
        !selectedTags.some(selected => selected.id === tag.id)
      ));
    } else {
      setSuggestions(allTags
        .filter(tag => !selectedTags.some(selected => selected.id === tag.id))
        .slice(0, maxSuggestions)
      );
    }
  };

  const resetInput = () => {
    setInputValue('');
    setIsAdding(false);
    setSuggestions([]);
  };
  
  const addTag = async (tag: Tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      const updatedTags = [...selectedTags, tag];
      onTagsChange(updatedTags);
    }
    resetInput();
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const existingTag = suggestions.find(t => 
        t.name.toLowerCase() === inputValue.toLowerCase()
      );
      
      if (existingTag) {
        await addTag(existingTag);
      } else {
        const newTag = await tagStore.createTag(inputValue.trim());
        await addTag(newTag);
      }
    }
    if (e.key === 'Escape') {
      setIsAdding(false);
      setSuggestions([]);
    }
  };

  const removeTag = (tagId: string) => {
    const updatedTags = selectedTags.filter(tag => tag.id !== tagId);
    onTagsChange(updatedTags);
  };

  return (
    <div className={`${styles.root} ${styles.container} ${className || ''}`}>
      <div className={styles.tagList}>
        {selectedTags.map(tag => (
          <div key={tag.id} className={styles.tag}>
            <span>{tag.name}</span>
            <button
              onClick={() => removeTag(tag.id)}
              className={styles.removeButton}
            >
              <XMarkIcon className={styles.xIcon} />
            </button>
          </div>
        ))}
        
        {isAdding ? (
          <div className={styles.inputContainer}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type to add tag"
              className={styles.input}
              onFocus={() => setSuggestions(
                allTags
                  .filter(tag => !selectedTags.some(selected => selected.id === tag.id))
                  .slice(0, maxSuggestions)
              )}
              onBlur={() => {
                if ( !isSelectingTag.current) {
                  resetInput();
                }
              }}
            />
            {suggestions.length > 0 && (
              <div className={styles.suggestions}>
                {suggestions.map(tag => (
                  <div
                    key={tag.id}
                    className={styles.suggestionItem}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      isSelectingTag.current = true;
                      addTag(tag);
                      isSelectingTag.current = false;
                    }}
                  >
                    {tag.name}
                  </div>
                ))}
                {allTags.length > maxSuggestions && suggestions.length === maxSuggestions && (
                  <div className={styles.moreSuggestions}>
                    Type a letter for more...
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleAddClick}
            className={styles.addButton}
          >
            <TagIcon className={styles.plusIcon} />
          </button>
        )}
      </div>
    </div>
  );
}; 