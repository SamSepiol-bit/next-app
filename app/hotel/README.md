# 🏨 Hotel Management Component (React + Next.js)

This project is a **client-side Hotel Management page** built with **React (Next.js App Router)**. It allows users to **add, view, edit, and delete hotels**, including a **multi-image slider**, with hotel text data persisted in **localStorage**.

> ⚠️ Images are stored in memory only (`File[]`) and will not persist after a page refresh due to browser limitations.

---

## 📌 Features

* Add new hotels using a modal form
* Upload **at least 5 images** per hotel
* Image slider (previous / next)
* Edit hotel details
* Delete hotels with confirmation
* Persist hotel **text data** using `localStorage`
* Responsive grid layout

---

## 🧠 High-Level Architecture

```
Hotel Page
 ├── Header (Add Hotel button)
 ├── Hotel Cards Grid
 │    ├── Image Slider
 │    ├── Hotel Details
 │    └── Edit / Delete Actions
 └── Modal Form (Add / Update Hotel)
```

---

## 🧾 Data Models

### `StoredHotel`

Used for **localStorage persistence** (text-only data).

```ts
interface StoredHotel {
  id: number;
  hotelName: string;
  location: string;
  contact: string;
  rating: number;
}
```

### `HotelData`

Used inside **React state**, extends `StoredHotel` with images.

```ts
interface HotelData extends StoredHotel {
  images: File[];
}
```

---

## 🖼 ImageSlider Component Logic

* Accepts an array of `File` objects
* Uses `useState` to track the active image index
* Uses modulo (`%`) logic to loop images
* Converts `File` → preview using `URL.createObjectURL`

### Key Concepts:

* Circular navigation
* Local component state
* Temporary object URLs

---

## ⚙️ State Management (Main Component)

### Core States

| State                          | Purpose                        |
| ------------------------------ | ------------------------------ |
| `hotels`                       | Stores all hotel cards         |
| `showForm`                     | Controls modal visibility      |
| `editId`                       | Distinguishes Add vs Edit mode |
| `hotelName, location, contact` | Form fields                    |
| `rating`                       | Star rating                    |
| `images`                       | Uploaded images (`File[]`)     |

---

## 💾 LocalStorage Handling

### Load on Page Load

```ts
useEffect(() => {
  const stored = localStorage.getItem("hotels");
  if (!stored) return;

  const parsed: StoredHotel[] = JSON.parse(stored);

  setHotels(
    parsed.map((h) => ({
      ...h,
      images: [], // images cannot be restored
    }))
  );
}, []);
```

### Save (Text Data Only)

```ts
const saveToLocalStorage = (data: HotelData[]) => {
  const withoutImages: StoredHotel[] = data.map(
    ({ images, ...rest }) => rest
  );
  localStorage.setItem("hotels", JSON.stringify(withoutImages));
};
```

> ❗ `File[]` cannot be saved in localStorage.

---

## 📷 Image Upload Logic

* Triggered on file input change
* Requires **minimum 5 images**
* Converts `FileList` → `File[]`
* Stores images in React state

```ts
if (files.length < 5) {
  alert("Upload at least 5 images");
  return;
}
```

---

## 📨 Form Submission Logic

### Add Mode

* `editId === null`
* Creates a new hotel with `Date.now()` as ID

### Edit Mode

* `editId !== null`
* Updates the matching hotel in state

```ts
if (editId) {
  // update existing hotel
} else {
  // add new hotel
}
```

Both cases:

* Update state
* Save text data to localStorage
* Reset form

---

## ✏️ Edit Flow

1. Click **Edit** button
2. Load hotel data into form
3. Set `editId`
4. Open modal
5. Submit → updates hotel

---

## ❌ Delete Flow

1. Click **Delete**
2. Confirmation dialog
3. Remove hotel from state
4. Update localStorage

---

## 🧹 Form Reset Logic

Used when:

* Cancelling modal
* After submit

Resets:

* All form fields
* Image state
* Rating
* Edit mode

---

## 🎨 UI Rendering Rules

* Hotels rendered using `map()`
* ImageSlider shown **only if images exist**
* Modal rendered **conditionally**

```tsx
{showForm && <Modal />}
```

---

## ⚠️ Known Limitation

❌ **Images do not persist after page refresh**

### Why?

* `File` objects cannot be serialized
* Browser security limitation

### Solutions:

* Convert images to Base64
* Use IndexedDB
* Upload to backend (recommended)

---

## 🚀 Possible Improvements

* IndexedDB for image persistence
* Auto-sliding image carousel
* Image compression
* Backend API integration
* Form validation library (Zod / Yup)

---

## ✅ Conclusion

This component demonstrates:

* Clean React state management
* Practical localStorage usage
* Modal-driven CRUD workflow
* Image preview handling

Perfect for **learning React fundamentals** and **client-side data handling**.

---

Happy coding 🚀


Hotel Management System - Sorting Implementation Guide
📋 Overview

This document explains the sorting logic and UI improvements implemented in the Hotel Management System. The system now features a single dropdown button for sorting hotels by name or rating, replacing two separate buttons for a cleaner interface.
🎯 Problem Statement

Before: Two separate sorting buttons (Name and Rating) occupied unnecessary space and created UI clutter.
After: A single dropdown button elegantly contains all sorting options, improving user experience and saving screen real estate.
🔧 Technical Implementation
1. State Management Setup
typescript

// Define sorting state with TypeScript union types
const [sortOption, setSortOption] = useState<"none" | "name" | "rating">("none");
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

Concept: State Management with Type Safety

    sortOption: Tracks WHAT property we're sorting by

    sortDirection: Tracks the ORDER of sorting (ascending/descending)

    TypeScript union types ("none" | "name" | "rating") restrict values to only these options

    This follows the Single Source of Truth principle

2. Sorting Algorithm Logic
typescript

const filteredHotels = [...hotels]
  .filter((hotel) =>
    hotel.hotelName.toLowerCase().includes(search.toLowerCase()) ||
    hotel.location.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => {
    if (sortOption === "name") {
      const comparison = a.hotelName.localeCompare(b.hotelName);
      return sortDirection === "asc" ? comparison : -comparison;
    } 
    else if (sortOption === "rating") {
      const comparison = a.rating - b.rating;
      return sortDirection === "asc" ? comparison : -comparison;
    }
    return 0; // No sorting when sortOption is "none"
  });

Line-by-line breakdown:

    [...hotels] - Array Shallow Copy

        Creates a new array instance from hotels

        Prevents mutation of the original array (functional programming principle)

        Essential because .sort() mutates the array

    .filter() - Search Filtering

        First applies search filter to reduce dataset

        Uses .toLowerCase() for case-insensitive matching

        Searches both hotel name and location

    .sort() - Array Sorting Method

        Built-in JavaScript array method

        Takes a comparator function that returns:

            Negative number: a comes before b

            Positive number: b comes before a

            Zero: positions unchanged

    String Comparison: a.hotelName.localeCompare(b.hotelName)

        localeCompare(): JavaScript method for locale-aware string comparison

        Returns:

            -1: a comes before b alphabetically

            0: strings are equal

            1: a comes after b alphabetically

        Respects locale-specific rules (accents, special characters)

    Number Comparison: a.rating - b.rating

        Simple subtraction for numeric comparison

        Returns negative if a.rating < b.rating

        Returns positive if a.rating > b.rating

        Returns zero if equal

    Direction Control: sortDirection === "asc" ? comparison : -comparison

        Ternary Operator: Conditional expression

        If ascending: return comparison as-is

        If descending: return negative of comparison (reverses order)

        Pattern: -comparison flips the sort direction

    return 0 - Default Case

        When sortOption === "none", comparator returns 0

        This keeps the array in its original order

3. Helper Functions for UI Display
typescript

const getSortDisplayText = () => {
  if (sortOption === "none") return "Sort by";
  if (sortOption === "name") return `Name ${sortDirection === "asc" ? "↑" : "↓"}`;
  if (sortOption === "rating") return `Rating ${sortDirection === "asc" ? "↑" : "↓"}`;
  return "Sort by";
};

const getSortIcon = () => {
  if (sortOption === "none") return <ChevronDown size={18} />;
  return sortDirection === "asc" ? <ChevronUp size={18} /> : <ChevronDown size={18} />;
};

Concept: Separation of Concerns

    getSortDisplayText(): Business logic for button text

    getSortIcon(): Business logic for button icon

    Benefit: UI components only worry about display, not logic

4. Sorting Handler Function
typescript

const handleSortChange = (option: "none" | "name" | "rating") => {
  if (option === "none") {
    setSortOption("none");
    return;
  }
  
  if (sortOption === option) {
    // Toggle direction if same option clicked
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  } else {
    // Set new option with default ascending direction
    setSortOption(option);
    setSortDirection("asc");
  }
};

Logic Flow:

    Reset Case: If "none" selected, just reset sorting

    Same Option Clicked: Toggle direction (asc↔desc)

    Different Option Clicked: Set new option, reset to ascending

Pattern: State Transition Logic

    Clear rules for how state changes based on user actions

    Prevents inconsistent states

5. Dropdown UI Implementation
tsx

{/* Single Sorting Dropdown */}
<div className="relative group">
  <button className="px-4 py-2 bg-[var(--color-dark-600)] text-[var(--color-dark-text-100)] rounded-lg flex items-center gap-2 hover:bg-[var(--color-dark-700)] transition">
    {getSortIcon()}
    <span>{getSortDisplayText()}</span>
  </button>
  
  {/* Dropdown Menu */}
  <div className="absolute right-0 mt-2 w-48 bg-[var(--color-dark-700)] rounded-lg shadow-lg border border-[var(--color-dark-600)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
    <div className="py-1">
      <button onClick={() => handleSortChange("none")}>
        None (Default)
      </button>
      <button onClick={() => handleSortChange("name")}>
        <span>Name</span>
        {sortOption === "name" && (
          <span className="text-xs">
            {sortDirection === "asc" ? "A → Z" : "Z → A"}
          </span>
        )}
      </button>
      <button onClick={() => handleSortChange("rating")}>
        <span>Rating</span>
        {sortOption === "rating" && (
          <span className="text-xs">
            {sortDirection === "asc" ? "Low → High" : "High → Low"}
          </span>
        )}
      </button>
    </div>
  </div>
</div>

CSS Concepts Applied:

    relative group - Parent Positioning Context

        relative: Establishes positioning context for absolute children

        group: Tailwind CSS utility for parent-child hover states

    absolute right-0 mt-2 - Dropdown Positioning

        absolute: Removes from document flow, positions relative to parent

        right-0: Aligns to right edge of parent

        mt-2: Margin top for spacing

    opacity-0 invisible group-hover:opacity-100 - Show/Hide Animation

        Initial: Hidden with opacity 0 and invisible

        On parent hover: Opacity 100 and visible

        transition-all duration-200: Smooth animation

    z-10 - Stacking Context

        Ensures dropdown appears above other elements

    Conditional Rendering Pattern:
    tsx

{sortOption === "name" && (
  <span>A → Z</span>
)}

        Only shows direction indicator when that option is active

        Uses logical AND (&&) operator for conditional rendering

🎨 UI/UX Design Patterns
1. Progressive Disclosure

    Initially shows only main button

    Reveals options on hover/interaction

    Reduces cognitive load

2. Affordance

    Downward chevron indicates "click for more options"

    Arrow icons (↑↓) clearly indicate sort direction

    Hover effects provide feedback

3. State Visibility

    Button text updates to show current sort

    Active option highlighted in blue

    Direction indicators show sort order

4. Error Prevention

    TypeScript prevents invalid sort options

    Clear "None (Default)" option to reset

    Consistent behavior across interactions

🔄 React Patterns Used
1. Declarative UI
tsx

<span>{getSortDisplayText()}</span>

    UI declares WHAT to show, not HOW to show it

    React handles the rendering based on state

2. Unidirectional Data Flow
text

User Action → State Update → UI Re-render

    User clicks sort option

    handleSortChange updates state

    React re-renders affected components

    UI reflects new state

3. Derived State
typescript

const filteredHotels = [...hotels].filter(...).sort(...);

    filteredHotels is calculated from other state (hotels, search, sortOption, sortDirection)

    React automatically re-calculates when dependencies change

4. Component Composition

    Small, focused helper functions

    Each component has single responsibility

    Easy to test and maintain

📊 Performance Considerations
1. Memoization Potential
typescript

// Could be optimized with useMemo
const filteredHotels = useMemo(() => {
  return [...hotels]
    .filter(...)
    .sort(...);
}, [hotels, search, sortOption, sortDirection]);

    useMemo would prevent re-calculation on every render

    Only re-calculates when dependencies change

2. Array Operations Efficiency

    .filter() before .sort() reduces sorting workload

    Shallow copy ([...hotels]) is O(n) operation

    Sorting is O(n log n) operation

🧪 Testing Considerations
Unit Tests to Write:
typescript

// Test sorting logic
test('sorts hotels by name ascending', () => {
  const hotels = [{hotelName: 'B Hotel'}, {hotelName: 'A Hotel'}];
  const sorted = sortHotels(hotels, 'name', 'asc');
  expect(sorted[0].hotelName).toBe('A Hotel');
});

// Test UI state
test('button shows correct text for name sort', () => {
  render(<SortButton sortOption="name" sortDirection="asc" />);
  expect(screen.getByText('Name ↑')).toBeInTheDocument();
});

🔍 Debugging Tips
Common Issues:

    Sorting not working:
    javascript

// Check: Are you creating a copy?
hotels.sort(...) // ❌ Mutates original
[...hotels].sort(...) // ✅ Creates copy

    UI not updating:

        Verify state is actually changing (console.log)

        Check React DevTools for state values

        Ensure all dependencies in dependency arrays

    Type errors:

        TypeScript will catch invalid sort options

        Check union type definitions

🚀 Future Improvements
1. Accessibility
tsx

<button 
  aria-label={`Sort by ${sortOption} ${sortDirection}`}
  aria-expanded={isDropdownOpen}
>

2. More Sort Options
typescript

type SortOption = "none" | "name" | "rating" | "location" | "dateAdded";

3. Persistent Sort
typescript

// Save to localStorage
useEffect(() => {
  localStorage.setItem('hotelSort', JSON.stringify({sortOption, sortDirection}));
}, [sortOption, sortDirection]);

📚 Key Takeaways
1. State-Driven Design

    UI is a function of state

    State changes trigger re-renders

    Single source of truth

2. Separation of Concerns

    Logic in helper functions

    UI in components

    Data flow is clear

3. User-Centric UI

    Progressive disclosure

    Clear feedback

    Intuitive interactions

4. Type Safety

    TypeScript prevents runtime errors

    Clear contract for data and functions

    Better developer experience

This implementation follows modern React best practices while maintaining simplicity and user-friendliness. The sorting logic is efficient, the UI is intuitive, and the code is maintainable.