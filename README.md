# tagger-on-it

A simple React component for selecting and managing tags with autocomplete functionality. The component supports both light and dark modes and provides a smooth user experience for tag management.

<!-- ![TagSelector Screenshot](tag-selector.png) -->
![Tagger-on-it](tagger-on-it.gif) 

## Features

- 🏷️ Add and remove tags
- 🔍 Autocomplete suggestions
- 🌓 Light and dark mode support
- 💾 Custom tag storage integration
- 🎨 Customizable styling


## Installation

![Tagger-on-it-install](tagger-on-it-install.gif) 


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
      MultiTenantExample.tsx
      SupabaseExample.tsx
  ```

4. Replace the App.tsx file created by the Vite project with the following:
```tsx
import { useState } from 'react'
import './App.css'
import SimpleExample from './examples/SimpleExample'
import LocalStorageExample from './examples/LocalStorageExample'
import AsyncExample from './examples/AsyncExample'
import MultiTenantExample from './examples/MultiTenantExample'
export default function App() {
  const containerStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    width: '90%'
  }
  return (
    <>
      <div align="center">
        <div style={containerStyle}>
          <SimpleExample />
        </div>
        <div style={containerStyle}>
          <LocalStorageExample />
        </div>
        <div style={containerStyle}>
          <AsyncExample />
        </div>
        <div style={containerStyle}>
          <MultiTenantExample />
        </div>
      </div>
    </>
  )
}

```

5. (__Optional__) The Supabase example is a more complex example that demonstrates how to use the component with a Supabase database. Do the following if you want to try it:

- Create a Supabase project (it's free to test)
- Copy the Supabase url and anon key into an .env.local file in your test project's root
    ```
    VITE_SUPABASE_URL=
    VITE_SUPABASE_ANON_KEY=
    ```
- Run this SQL in Supabase (this assumes you're using the default 'public' schema)
    ```
    CREATE TABLE public.users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE public.user_tags (
        tag_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL,
        tag_name VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
    );
    ```
- Install the following dependencies:
  ```
  npm install @supabase/supabase-js 
  npm install --save-dev @types/node
  ```
- Add the SupabaseExample component to your App.jsx file:
  ```tsx
  <div style={containerStyle}>
    <SupabaseExample />
  </div>
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


---
## License
MIT

---
## attributions

- [Heroicons](https://heroicons.com/) for the icons