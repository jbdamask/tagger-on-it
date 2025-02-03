# tagger-on-it

A simple React component for selecting and managing tags with autocomplete functionality. The component supports both light and dark modes and provides a smooth user experience for tag management.

<!-- ![TagSelector Screenshot](tag-selector.png) -->
![Tagger-on-it](tagger-on-it-video.gif) 

## Features

- 🏷️ Add and remove tags
- 🔍 Autocomplete suggestions
- ⌨️ Keyboard navigation support
- 🌓 Light and dark mode support
- 💾 Custom tag storage integration
- 🎨 Customizable styling

## Requirements

To use this component, your project needs:

- React 16.8.0 or higher (for Hooks support)
- React DOM 16.8.0 or higher
- Tailwind CSS (for styling)

If using TypeScript (optional):
- TypeScript 4.5.0 or higher
- React TypeScript definitions

## Installation

1. You can quickly test this component by creating a new Vite project:
```
npm create vite@latest tagger-test -- --template react
```

2. Copy the TagSelector directory to src/components
```
src/
  components/
    TagSelector/
      TagSelector.tsx
      types.ts
      TagSelector.module.css
      icons/
        index.ts
      index.ts
```

3. Copy the examples directory to src/examples

Each example demonstrates different usage patterns and implementation strategies for the TagSelector component. Review the example code to understand different ways to integrate the component with various storage mechanisms.
```
src/
  examples/
    SimpleExample.tsx
    LocalStorageExample.tsx
    AsyncExample.tsx
```

4. Replace the App.tsx file created by the Vite project with the following:
```tsx
import { useState } from 'react'
import './App.css'
import SimpleExample from './examples/SimpleExample'
import LocalStorageExample from './examples/LocalStorageExample'
import AsyncExample from './examples/AsyncExample'
export default function App() {
  return (
    <>
    <div align="center">
      <div>
        <SimpleExample />
      </div>
      <div>
        <LocalStorageExample />
      </div>
      <div>
        <AsyncExample />
      </div>
    </div>
    </>
  )
}


```

## Usage

```tsx
import { TagSelector } from './components/TagSelector';
import { TagStore } from './components/TagSelector/types';

// Implement your tag store
const myTagStore: TagStore = {
  searchTags: async (query) => {
    // Implement tag search logic
    return [];
  },
  createTag: async (name) => {
    // Implement tag creation logic
    return { id: 'new-id', name };
  },
  getAllTags: async () => {
    // Implement fetching all tags
    return [];
  },
};

function MyComponent() {
  const [selectedTags, setSelectedTags] = useState([]);

  return (
    <TagSelector
      selectedTags={selectedTags}
      tagStore={myTagStore}
      onTagsChange={setSelectedTags}
      className="custom-class"
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `selectedTags` | `Tag[]` | Yes | Array of currently selected tags |
| `tagStore` | `TagStore` | Yes | Interface for tag operations |
| `onTagsChange` | `(tags: Tag[]) => void` | Yes | Callback when tags change |
| `className` | `string` | No | Additional CSS classes |

## TagStore Interface

The component requires a `TagStore` implementation with the following methods:

```typescript
interface TagStore {
  searchTags: (query: string) => Promise<Tag[]>;
  createTag: (name: string) => Promise<Tag>;
  getAllTags: () => Promise<Tag[]>;
}

interface Tag {
  id: string;
  name: string;
}
```

## Features in Detail

### Tag Management
- Click the tag icon to start adding tags
- Type to search existing tags or create new ones
- Press Enter to add the typed tag
- Click the X icon to remove tags

### Autocomplete
- Shows suggestions as you type
- Displays up to 100 suggestions at a time
- Allows selecting from suggestions with mouse or keyboard
- Creates new tags if no matching tag exists

### Styling
- Responsive design
- Automatic dark mode support
- Customizable via CSS modules
- Smooth transitions and hover effects

## CSS Customization

The component uses CSS modules and CSS variables for styling. You can override the default styles by targeting the following CSS variables:

```css
.root {
  --border-color: #e5e7eb;
  --tag-bg: #f3f4f6;
  --text-primary: #000000;
  --text-secondary: #6b7280;
  --bg-primary: #ffffff;
  --input-bg: #ffffff;
  --hover-bg: #f3f4f6;
  --shadow-color: rgb(0 0 0 / 0.1);
}
```

<!-- ## TagStore Examples

### Simple Local Storage Implementation
This basic implementation stores tags in the browser's localStorage:

```typescript
class LocalTagStore implements TagStore {
  private storageKey = 'tags';
  
  async searchTags(query: string): Promise<Tag[]> {
    const tags = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    return tags.filter(tag =>
      tag.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async createTag(name: string): Promise<Tag> {
    const tags = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const newTag = { id: generateId(), name: name.trim() };
    localStorage.setItem(this.storageKey, JSON.stringify([...tags, newTag]));
    return newTag;
  }

  async getAllTags(): Promise<Tag[]> {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }
}
```


### Multi-User Implementation
For multi-user applications you may want to associate users with tags. Here's how you would do it with a database-connected store:

```typescript
class UserTagStore implements TagStore {
  constructor(private userId: string) {}
  
  async searchTags(query: string): Promise<Tag[]> {
    // Query your database for tags matching this user
    // Example: SELECT FROM tags WHERE user_id = :userId AND name LIKE :query
    return tags;
  }
  async createTag(name: string): Promise<Tag> {
    // Insert tag with user association
    // Example: INSERT INTO tags (id, name, user_id) VALUES (:id, :name, :userId)
    return newTag;
  }
  async getAllTags(): Promise<Tag[]> {
    // Get all tags for this user
    // Example: SELECT FROM tags WHERE user_id = :userId
    return tags;
  }
}

// Usage:
const userTagStore = new UserTagStor(currentUserId);
<TagSelector store={userTagStore} />
``` -->

## Examples

The package includes several example implementations in the `examples` directory:

- `SimpleExample.tsx` - Basic in-memory implementation
- `LocalStorageExample.tsx` - Persistent storage using localStorage
- `AsyncExample.tsx` - Async implementation with loading states


---
## License
MIT

---
## attributions

- [Heroicons](https://heroicons.com/) for the icons