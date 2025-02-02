# BROKEN - DON'T USE UNTIL INSTALLATION INSTRUCTIONS ARE FIXED

# tagger-on-it

A simple React component for selecting and managing tags with autocomplete functionality. The component supports both light and dark modes and provides a smooth user experience for tag management.

![TagSelector Screenshot](tag-selector.png)

## Features

- 🏷️ Add and remove tags
- 🔍 Autocomplete suggestions
- ⌨️ Keyboard navigation support
- 🌓 Light and dark mode support
- 💾 Custom tag storage integration
- 🎨 Customizable styling

## Installation & Quick Start

### 1. Get the Component Files

Choose one of these options:

#### Option A: Clone the Repository
```bash
git clone https://github.com/yourusername/tagger-on-it.git
cd tagger-on-it
```

#### Option B: Manual File Copy
Copy these files directly into your project:
- `src/components/TagSelector/TagSelector.tsx`
- `src/components/TagSelector/types.ts`
- `src/components/TagSelector/TagSelector.module.css`
- `src/components/TagSelector/icons/index.ts`
- `src/components/TagSelector/index.ts`

### 2. Configure Tailwind CSS

Ensure your `tailwind.config.js` or `tailwind.config.ts` includes the directory where you'll place the component:

```js
content: [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./pages/**/*.{js,jsx,ts,tsx}",
  "./components/**/*.{js,jsx,ts,tsx}",
  "./src/components/**/*.{js,ts,jsx,tsx}",
],
```

### 4. Check Out the Examples

See the `examples` directory for different implementation patterns:

- `SimpleExample.tsx` - Basic in-memory implementation
- `LocalStorageExample.tsx` - Persistent storage using localStorage
- `AsyncExample.tsx` - Async implementation with loading states

To use an example:
1. Copy the desired example file from the `examples` directory into your project
2. Import and use the example component in your app:
```tsx
import SimpleExample from './path/to/SimpleExample';

function App() {
  return (
    <div>
      <SimpleExample />
    </div>
  );
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

## TagStore Examples

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
```

## License
MIT

## Dependencies Licenses

This component uses the following open source dependencies:

### Development Dependencies

- **@types/node** (v20.11.0) - [MIT License](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/LICENSE)
- **@types/react** (v18.2.0) - [MIT License](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/LICENSE)
- **@types/react-dom** (v18.2.0) - [MIT License](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/LICENSE)
- **@types/uuid** (v9.0.7) - [MIT License](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/LICENSE)
- **autoprefixer** (v10.4.20) - [MIT License](https://github.com/postcss/autoprefixer/blob/main/LICENSE)
- **postcss** (v8.5.1) - [MIT License](https://github.com/postcss/postcss/blob/main/LICENSE)
- **tailwindcss** (v4.0.3) - [MIT License](https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE)
- **typescript** (v5.3.0) - [Apache License 2.0](https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt)

## Examples

The package includes several example implementations in the `examples` directory:

- `SimpleExample.tsx` - Basic in-memory implementation
- `LocalStorageExample.tsx` - Persistent storage using localStorage
- `AsyncExample.tsx` - Async implementation with loading states

### Running the Examples

1. Copy the desired example file from the `examples` directory into your project

2. Import and use the example component in your app:
```tsx
import SimpleExample from './path/to/SimpleExample';

function App() {
  return (
    <div>
      <SimpleExample />
    </div>
  );
}
```

Each example demonstrates different usage patterns and implementation strategies for the TagSelector component. Review the example code to understand different ways to integrate the component with various storage mechanisms.

---

