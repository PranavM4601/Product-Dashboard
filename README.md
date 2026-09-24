# Product Admin Dashboard

A responsive, feature-rich product management dashboard built with Next.js. This application interfaces with the DummyJSON API to provide comprehensive inventory management, including authentication, pagination, complex sorting/filtering, and local state mutation handling.

**Live Demo:** (https://product-dashboard-4wqx.vercel.app/)

## Tech Stack
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **HTTP Client:** Axios (Centralized interceptors for auth/error handling)
* **Notifications:** React Toastify
* **API:** DummyJSON

## Core Features Completed
* **Authentication:** JWT-based login system (POST `/auth/login`) with protected routes and automatic logout on 401 errors.
* **Advanced Data Table:** Server-side pagination (`limit` and `skip`), dynamic search with debouncing, and multi-parameter filtering/sorting. Shows a table on desktop and cards on mobile.
* **URL State Synchronization:** Page, search, filter, and sort values are synced to the URL, making states shareable and refresh-proof.
* **Robust Error Handling:** Protects against invalid URL params (e.g., `?page=abc`), prevents rapid double-clicks on API requests, and provides loading/empty/retry UI states.
* **Hybrid Data Management:** Because the API is read-only, additions, updates, and deletions are saved locally. *(Note: A page refresh is required after modifying data to see the changes reflected in the UI).*

## Developer Notes & Assignment Explanations

### 1. API Search & Category Filter Limitation
**The Challenge:** DummyJSON does not allow simultaneous text search (`/search?q=`) and category filtering (`/category/`). 
**My Approach:** I implemented a mutual exclusion strategy. If a user has a category selected and begins typing in the search bar, the application prioritizes the search query and clears the category filter (and vice versa). This prevents broken API calls and ensures the user always gets a valid data response based on their most recent action.

### 2. Architecture & Data Strategy (Mock API Limitations)
**The Challenge:** `POST`, `PUT`, and `DELETE` requests return success responses but do not persistently modify the server's database. 
**My Approach:** I implemented a hybrid data synchronization strategy using browser `localStorage`.
* **Delta Tracking:** The app intercepts API modifications and saves the deltas (newly added products, edited fields, deleted IDs) locally.
* **Data Merging & Refresh:** When a user modifies data, it commits to `localStorage`. Upon refreshing the page, the client fetches the baseline server response and seamlessly merges it with the local storage deltas.
* **Sorting Local Items:** To maintain strict adherence to server-side pagination while preventing new items from disappearing, locally added products are intentionally "pinned" to the top of the combined list.

### 3. A Problem Faced and Fixed
**Problem:** Handling race conditions and unnecessary API calls when a user types quickly in the search bar. If a user typed "phone" rapidly, the API call for "ph" might take longer to return than the call for "phone," causing the older, incorrect results to overwrite the final data.
**Solution:** I implemented a custom debouncing logic to wait until the user stopped typing before triggering the fetch. To completely eliminate race conditions, I also integrated Axios with an `AbortController` inside my `useEffect`. If a new search fetch is triggered before the previous one finishes, the cleanup function aborts the stale request, guaranteeing the UI always reflects the most recent query.

### 4. AI Assistance
AI was utilized as a thought partner and pair programmer during this project. Specifically, I used it to:
* Understand and implement the `AbortController` pattern with Axios to cleanly cancel pending API requests and resolve the search race condition.
* Brainstorm edge-cases for the `localStorage` data merging strategy, ultimately deciding to pin new items to the top to avoid server-side pagination conflicts.
* Quickly scaffold repetitive Tailwind CSS classes for the responsive table-to-card layout transitions.
* Troubleshoot and resolve the Vercel deployment caching and root directory routing issues.


## Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/PranavM4601/Product-Dashboard.git](https://github.com/PranavM4601/Product-Dashboard.git)
