# Frontend Decisions — Humayun Shahid (24K-2011)

This document records three core architectural and interaction decisions made while developing Pulse Studio, addressing concrete problems observed during reference site investigations.

---

## Decision 1: URL Query State Synchronization & Persistent Selection (Interaction / State)

- **Problem:**  
  On Mindbody (https://www.mindbodyonline.com/explore), when I applied filters and then went back, or reloaded the page, the filters I had applied were reset.

- **Possible business consequence:**  
  May cause users to become frustrated having to re-apply filters repeatedly and abandon planning their class schedule.

- **Decision:**  
  Store filters (search text `q`, category `type`, difficulty `level`, and sort order `sort`) in the URL query string using `useSearchParams` with `{ replace: true }`, maintain selected classes in `PlanContext`, and display a notification message when an active filter hides classes currently in the plan.

- **Alternative:**  
  Store filter state in component local state (`useState`) and clear selections or reset filter dropdowns on navigation.

- **Reason:**  
  Keeps filter state persistent across browser back/forward navigation and page reloads, and ensures users do not lose track of classes already in their plan when switching filter categories.

- **Tradeoff:**  
  Requires URL query parameter parsing and serialization logic, along with synchronizing URL state with active context selections.

- **Code location:**  
  `src/pages/ClassesPage.jsx` (`ClassesPage`, `changeFilter`), `src/context/PlanContext.jsx` (`PlanProvider`, `usePlan`).

- **Evidence:**  
  1. Open `/?type=Yoga` on the homepage.
  2. Click "Add to plan" on Sunrise Vinyasa.
  3. Change the type filter dropdown to "Cardio".
  4. Notice the message banner: *"1 class in your plan is hidden by these filters. View your plan"*.
  5. Click the browser Back button; notice the filter returns to `/?type=Yoga` and Sunrise Vinyasa is still in the plan.

---

## Decision 2: Upfront Pricing, Cancellation Terms, and Dynamic Capacity (Information Hierarchy)

- **Problem:**  
  On PureGym (https://www.puregym.com/classes/), the full cost, equipment charges and cancellation cutoff were not shown until the final checkout page.

- **Possible business consequence:**  
  May cause users to drop out at the final checkout step when unexpected fees or restrictive cancellation rules appear.

- **Decision:**  
  Display the price per spot, seats left, and cancellation condition directly on class cards, provide a full "Price and rules" breakdown (including Rs 150 mat rental, 1 to 4 spots limit, and group discount) on the class details page, and show an itemized summary on the plan page.

- **Alternative:**  
  Show only basic class titles and starting prices on listing cards, deferring mat rental fees and cancellation cutoffs to a final checkout screen.

- **Reason:**  
  Surfacing all pricing and conditions upfront gives students complete clarity before they invest time filling out forms, reducing surprise fees and dropouts.

- **Tradeoff:**  
  Cards and details views include more textual information, requiring clear typographic hierarchy and spacing.

- **Code location:**  
  `src/components/ClassCard.jsx` (`ClassCard`), `src/pages/ClassDetailsPage.jsx` (`ClassDetailsPage`), `src/pages/PlanPage.jsx` (`PlanPage`).

- **Evidence:**  
  1. Open `/` and inspect any class card (e.g. Sunrise Vinyasa); observe the price per spot (Rs 1,200), remaining spots, and cancellation condition ("Arrive 10 minutes early. Cancel free up to 12 hours before.") directly on the card.
  2. Click "Details" to open `/classes/1`; inspect the "Price and rules" section detailing optional mat rental (+Rs 150), spot limit (1 to 4), and group discount eligibility.
  3. Click "Add to plan" and navigate to `/plan`; view the itemized summary detailing spots, class subtotal, mat rental fees, group discount, and net total.

---

## Decision 3: Guided Recovery for Zero-Result States and Mobile-First Touch Targets (Mobile Layout & Recovery)

- **Problem:**  
  On ClassPass (https://classpass.com/search), when a search had no results, nothing helped a user who did not know how to set filters properly (no suggested alternatives), and many controls were very small and hard to tap on mobile.

- **Possible business consequence:**  
  May cause users on mobile devices to encounter a dead end, mis-tap small controls, and leave the site.

- **Decision:**  
  Provide an empty state with an explanatory message, a "Clear all filters" button, and three suggested alternative classes, while enforcing a minimum height of 44px on buttons, inputs, and selects and stacking plan rows into a single column on mobile.

- **Alternative:**  
  Show a static "No classes found" text without suggested alternatives or reset buttons, and leave form controls at default unpadded browser heights.

- **Reason:**  
  Prevents users from getting stuck in a dead-end state and ensures touch targets are comfortable and easy to tap on mobile phone screens.

- **Tradeoff:**  
  Suggested alternatives require fallback filtering logic, and 44px touch targets occupy more vertical space on compact screens.

- **Code location:**  
  `src/pages/ClassesPage.jsx` (`ClassesPage`), `src/styles/main.css` (`.btn`, `input`, `select`, `@media (max-width: 700px)`).

- **Evidence:**  
  1. In the search input on `/`, type "zzz".
  2. Observe the message "No classes match your search", the "Clear all filters" button, and 3 suggested classes in "Other classes you might like".
  3. Click "Clear all filters" to reset the search and view all classes again.
  4. In browser DevTools, switch to a mobile viewport (e.g. 390px); notice all buttons, inputs, and selects maintain at least 44px height, and plan items stack into a single column.

---

## Verification notes

| Improvement | Actions | Expected | Observed |
|---|---|---|---|
| URL Query State Synchronization | Open `/?type=Yoga`, add Sunrise Vinyasa to plan, change filter dropdown to `type=Cardio`, then reload or press Back. | Notice the banner "1 class in your plan is hidden by these filters. View your plan". Clicking Back restores `/?type=Yoga` and Sunrise Vinyasa remains in the plan. | Verified by testing URL query params and reading `ClassesPage.jsx` and `PlanContext.jsx`. |
| Upfront Pricing & Information Hierarchy | View cards on `/`, navigate to `/classes/1`, adjust spots on `/plan`. | Class card displays Rs 1,200/spot, remaining spots, and cancellation condition; details page shows full "Price and rules" breakdown; `/plan` displays real-time itemized calculation and applies 10% discount at 5 spots. | Verified by checking UI rendering and running automated business rule tests (5/5 pass). |
| Zero-Result Recovery & 44px Mobile Controls | Type "zzz" into search input on `/`; inspect interactive element heights in responsive mode at 390px width. | Zero-result state displays "Clear all filters" button and 3 alternative recommendations; buttons, inputs, and selects maintain a minimum height of 44px; plan line items stack vertically. | Verified by testing "zzz" search and checking CSS rules in `src/styles/main.css`. |
