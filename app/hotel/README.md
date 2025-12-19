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
