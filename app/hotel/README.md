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

---


🏨 Hotel Management System – Sorting Implementation Guide
📋 Overview

This document explains the sorting logic and UI improvements implemented in the Hotel Management System.

The system now features a single dropdown sorting button that allows users to sort hotels by name or rating, replacing multiple buttons for a cleaner and more scalable interface.

🎯 Problem Statement
❌ Before

Two separate sorting buttons (Name & Rating)

UI clutter

Poor scalability

✅ After

One dropdown button

Clean UI

Better UX and future extensibility

🔧 Technical Implementation
1️⃣ State Management Setup
// Define sorting state with TypeScript union types
const [sortOption, setSortOption] = useState<"none" | "name" | "rating">("none");
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

💡 Concepts Used

Type Safety via union types

Single Source of Truth

Prevents invalid sorting states

2️⃣ Sorting Algorithm Logic
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
    return 0;
  });

🔍 Line-by-Line Explanation
🧱 Array Copy
[...hotels]


Prevents mutation (.sort() mutates arrays)

Follows functional programming principles

🔍 Filtering
.filter(...)


Case-insensitive search

Searches hotel name and location

🔃 Sorting
.sort((a, b) => { ... })

Comparator Result	Meaning
< 0	a before b
> 0	b before a
0	No change
🔤 String Sorting (Name)
a.hotelName.localeCompare(b.hotelName)


Locale-aware

Handles accents & special characters

Returns -1, 0, or 1

🔢 Number Sorting (Rating)
a.rating - b.rating


Efficient numeric comparison

Simple and fast

🔁 Direction Toggle
sortDirection === "asc" ? comparison : -comparison


Flips sorting direction cleanly

Common and reliable pattern

3️⃣ Helper Functions (UI Logic)
📌 Sort Button Text
const getSortDisplayText = () => {
  if (sortOption === "none") return "Sort by";
  if (sortOption === "name") return `Name ${sortDirection === "asc" ? "↑" : "↓"}`;
  if (sortOption === "rating") return `Rating ${sortDirection === "asc" ? "↑" : "↓"}`;
  return "Sort by";
};

📌 Sort Icon
const getSortIcon = () => {
  if (sortOption === "none") return <ChevronDown size={18} />;
  return sortDirection === "asc"
    ? <ChevronUp size={18} />
    : <ChevronDown size={18} />;
};

🧠 Pattern Used

Separation of Concerns

Logic separated from JSX

Cleaner components

4️⃣ Sorting Handler Logic
const handleSortChange = (option: "none" | "name" | "rating") => {
  if (option === "none") {
    setSortOption("none");
    return;
  }

  if (sortOption === option) {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  } else {
    setSortOption(option);
    setSortDirection("asc");
  }
};

🔄 Logic Flow
Scenario	Result
Same option clicked	Toggle direction
New option clicked	Reset to ascending
None selected	Reset sorting
5️⃣ Dropdown UI Implementation
<div className="relative group">
  <button className="px-4 py-2 bg-[var(--color-dark-600)] rounded-lg flex items-center gap-2 hover:bg-[var(--color-dark-700)] transition">
    {getSortIcon()}
    <span>{getSortDisplayText()}</span>
  </button>

  <div className="absolute right-0 mt-2 w-48 bg-[var(--color-dark-700)] rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
    <div className="py-1">
      <button onClick={() => handleSortChange("none")}>None (Default)</button>

      <button onClick={() => handleSortChange("name")}>
        Name
        {sortOption === "name" && (
          <span className="text-xs">
            {sortDirection === "asc" ? "A → Z" : "Z → A"}
          </span>
        )}
      </button>

      <button onClick={() => handleSortChange("rating")}>
        Rating
        {sortOption === "rating" && (
          <span className="text-xs">
            {sortDirection === "asc" ? "Low → High" : "High → Low"}
          </span>
        )}
      </button>
    </div>
  </div>
</div>

🎨 UI / UX Patterns Used

Progressive Disclosure

Visual Feedback

Affordance (Icons & Arrows)

State Visibility

🔄 React Patterns Applied

Declarative UI

Derived State

Unidirectional Data Flow

Component Composition

📊 Performance Optimization (Optional)
const filteredHotels = useMemo(() => {
  return [...hotels].filter(...).sort(...);
}, [hotels, search, sortOption, sortDirection]);

🧪 Testing Ideas
test("sorts hotels by name ascending", () => {
  const hotels = [{ hotelName: "B" }, { hotelName: "A" }];
  expect(sortHotels(hotels, "name", "asc")[0].hotelName).toBe("A");
});

🚀 Future Improvements

Accessibility (aria-label, keyboard support)

Persist sort in localStorage

More sorting options (location, date added)

📚 Key Takeaways

✔ Clean state-driven design
✔ Type-safe sorting logic
✔ Scalable UI
✔ Professional UX

If you want, next I can:

Split sorting into a custom hook

Add keyboard accessibility

Convert this into documentation for GitHub

Just tell me 👌
