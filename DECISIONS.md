# Frontend Decisions — Humayun Shahid (24K-2011)

This document records three core architectural and interaction decisions made while developing Pulse Studio, addressing concrete problems observed in existing fitness and class booking platforms.

---

## Decision 1: URL Query State Synchronization & Persistent Selection (Interaction / State)

- **Problem Addressed:**  
  On reference platforms such as **Mindbody Web Explorer** (`https://www.mindbodyonline.com/explore`) and **ClassPass** (`https://classpass.com`), applying search queries and category filters (e.g., filtering for Yoga classes on Wednesday) is stored strictly in transient component state. When a user clicks on an individual class to inspect instructor bio or facility amenities and subsequently clicks the browser's "Back" button, all active filter parameters are completely wiped, returning the user to the unfiltered Monday view. Furthermore, if a user selects a class and then changes categories, their selected item vanishes from view with zero indication of whether the item is still reserved in their cart or was dropped.

- **Decision Chosen:**  
  1. Synchronize all filtering (type, difficulty level), text search (`q`), and sort order (`sort`) directly into the browser URL query string via `useSearchParams` with history replacement.
  2. Maintain selected classes globally in `PlanContext` independently of the active filter view.
  3. When an active filter conceals one or more classes currently in the user's booking plan, render a dedicated status message: *"[N] class(es) in your plan are hidden by these filters. View your plan"*.

- **Alternative Considered:**  
  Persist filter state in standard component `useState` and wipe selections whenever a user leaves the browsing page, or reset filters on each navigation.

- **Reason:**  
  Students frequently compare classes across disparate categories (e.g., balancing a high-intensity cardio session on Tuesday with a recovery yoga flow on Friday). Forcing users to re-apply their search terms and filters upon every navigation creates severe interaction fatigue. Providing an explicit visual bridge to hidden selections eliminates uncertainty and prevents accidental duplicate bookings.

- **Tradeoff:**  
  Requires URL serialization logic, synchronization between the router and state, and additional conditional notification elements in the DOM.

- **Code Location:**  
  `src/pages/ClassesPage.jsx` (`changeFilter`, `hiddenInPlan`, lines 13–27, 52–55, 72–77) and `src/context/PlanContext.jsx`.

- **Evidence:**  
  1. Navigate to `/?type=Yoga`.
  2. Add "Sunrise Vinyasa" to plan.
  3. Switch filter to `type=Cardio`.
  4. Notice the informational banner: *"1 class in your plan is hidden by these filters. View your plan"*.
  5. Click browser Back/Forward; notice filters and selections persist accurately without data loss.

---

## Decision 2: Upfront Pricing, Cancellation Terms, and Dynamic Capacity (Information Hierarchy)

- **Problem Addressed:**  
  On several commercial fitness booking platforms (including local Pakistani boutique studio portals such as **Studio 8 Fitness** `https://studio8.pk` and **FitFlex**), class listing cards display only teaser baseline figures (e.g., "From Rs 1,200"). Critical financial and operational constraints—such as mandatory equipment hire fees (mat rental), cancellation notice windows (e.g., "Cancel free up to 12 hours before"), remaining seat counts, and group booking rules—are concealed until the final checkout or payment modal. Customers only discover strict cancellation policies or surcharge fees after having already invested time entering personal information.

- **Decision Chosen:**  
  Adopt an upfront, layered information hierarchy:
  1. **Listing Cards (`ClassCard.jsx`):** Disclose base price per spot (`Rs 1,200`), exact seats remaining with color-coded status badges, and cancellation policies directly on every card.
  2. **Details Route (`ClassDetailsPage.jsx`):** Provide a comprehensive "Price and rules" breakdown detailing optional mat rental costs (`Rs 150/spot`), spot limits (1–4), experience prerequisites, and group discount eligibility (10% off for 5+ spots).
  3. **Plan View (`PlanPage.jsx`):** Display a real-time line-by-line summary itemizing class subtotals, mat fees, group discount deductions, and net total.

- **Alternative Considered:**  
  Keep cards minimalist by showing only class title, time, and instructor, deferring pricing breakdowns and operational conditions to a pop-up modal at final submission.

- **Reason:**  
  University students and budget-conscious gym-goers need complete financial clarity before committing. Surfacing all fees and rules upfront builds trust, reduces cart abandonment, and ensures students choose classes that suit their budget and schedule.

- **Tradeoff:**  
  Cards and detail views contain denser textual information, requiring careful typographic hierarchy, spacing, and responsive wrapping to remain legible on smaller mobile screens.

- **Code Location:**  
  `src/components/ClassCard.jsx` (lines 14–37), `src/pages/ClassDetailsPage.jsx` (lines 37–48), and `src/pages/PlanPage.jsx` (lines 78–91).

- **Evidence:**  
  Inspect class listings and detail views at both desktop (1280px) and mobile (390px) viewports; all pricing rates, remaining seats, equipment rental fees, and cancellation cutoff rules are immediately visible before any booking action is taken.

---

## Decision 3: Guided Recovery for Zero-Result States and Mobile-First Touch Targets (Mobile Layout & Recovery)

- **Problem Addressed:**  
  On standard booking websites, submitting a query with no matches (e.g., searching for an unavailable instructor, a non-existent sport like "Swimming", or combining overly restrictive filters) results in a blank, unstyled container displaying raw text like "0 results found". The user is left at a dead end with no suggestions or clear way forward. Furthermore, on viewports under 400px, filter controls often overlap, input boxes shrink below 30px in height, and touch targets become difficult to tap accurately.

- **Decision Chosen:**  
  1. Construct an explicit empty state component that distinguishes between an unpopulated schedule and a filter mismatch.
  2. For zero-match search/filter combinations, explain the issue clearly, provide a prominent one-tap `"Clear all filters"` button, and dynamically render a list of 3 suggested alternative classes that match the search keyword.
  3. Enforce a minimum 44px touch target height across all interactive elements (`input`, `select`, `button`), convert the multi-column plan layout into a single vertical stack on mobile (`@media (max-width: 700px)`), and maintain accessible focus rings.

- **Alternative Considered:**  
  Display only a standard alert box stating "No classes match your search" and require the user to manually reset each dropdown individually.

- **Reason:**  
  Users searching on mobile devices while commuting or between university classes should never experience an interaction dead-end. Providing suggested alternatives keeps the discovery journey active and dramatically reduces bounce rates.

- **Tradeoff:**  
  Suggested alternative classes may not perfectly match the user's initial granular intent and require additional filtering computations in React.

- **Code Location:**  
  `src/pages/ClassesPage.jsx` (lines 56–58, 86–97) and `src/styles/main.css` (lines 53–55, 69–71, 114–121).

- **Evidence:**  
  Enter `"zzz"` in the search input or combine "Cardio" with "Beginner" when no slots match. The UI surfaces the clear-filters button alongside alternative class recommendations, while maintaining accessible 44px+ touch targets on 390px mobile viewports.
