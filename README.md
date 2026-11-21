# Pulse Studio

**Student:** Humayun Shahid | **Roll no:** 24K-2011 | **Section:** BCY-5C | **Course:** CS4032 Web Programming, Assignment 02

For this assignment I built Pulse Studio, a fictional small-group fitness studio in F-7 Markaz, Islamabad, designed specifically for university students and young professionals. On the site, visitors can browse weekly class schedules, search and filter offerings, view comprehensive class details with transparent pricing and conditions, build a customized booking plan with equipment rentals, fill out a controlled booking form, and receive a simulated booking confirmation.

- **GitHub Repository:** https://github.com/FlyingxMascot/pulse-studio
- **Live Deployment (Vercel):** https://pulse-studio-tau.vercel.app/
- **Final Commit Hash:** fbce1c3388d4430774961791865197eb60b3aad6

## Commands
```bash
npm install      # install dependencies
npm run dev      # run local development server
npm run build    # produce optimized production build
npm test         # run automated business rule tests via node --test
```

## Main Routes
| Route | Purpose | Key Components |
|---|---|---|
| `/` | Weekly class timetable with search, multi-criteria filters, and sorting | `ClassesPage.jsx`, `FilterBar.jsx`, `ClassCard.jsx` |
| `/classes/:id` | Parameterized class details view with full conditions, equipment inclusions, and spot status | `ClassDetailsPage.jsx`, `StatusMessage.jsx` |
| `/plan` | Interactive selection summary, spot adjustments, mat rental toggles, and controlled booking form | `PlanPage.jsx`, `BookingForm.jsx` |
| `/confirmation` | Simulated booking summary with unique reference ID and breakdown | `ConfirmationPage.jsx` |
| `*` | 404 handler for invalid routes with recovery link | `NotFoundPage.jsx` |

## Operating Rules (Implemented in `src/rules/bookingRules.js`)
1. **Capacity Limit:** Each class allows 1 to 4 spots per booking and can never exceed remaining seats. The constraint is displayed directly adjacent to the input field. Booking 4 spots is accepted; booking 5 spots is blocked with immediate inline error feedback.
2. **Eligibility & Prerequisites:** Advanced classes (e.g. HIIT Margalla, Advanced Ashtanga) require intermediate or advanced fitness experience. If a user selects "Beginner", the form blocks submission and highlights the ineligible class.
3. **Pricing & Group Discount:** Bookings of 5 or more total spots automatically receive a 10% discount on class fees. Mat rentals (Rs 150/spot) are calculated separately and are non-discountable. A booking with 4 spots pays regular price; reaching 5 spots triggers the discount calculation.

## Reproducing Edge Cases
- **Loading Failure & Retry:** Check "Simulate loading failure" in the demo panel at the bottom of the page, click "Retry" to observe the error banner, then uncheck and click "Try again" to recover.
- **Dynamic Seat Changes:** Add "Spin Sprint" (3 spots available) to your plan, click "Make Spin Sprint full" in the demo controls, then open `/plan`. An inline error prevents confirmation until the overbooked class is updated or removed.
- **Stale / Corrupted LocalStorage:** Run `localStorage.setItem("pulse-studio-plan", '[{"id":999,"spots":2,"rentMat":false}]')` in the browser console and refresh. The application validates the IDs against live data, drops the non-existent class, and surfaces an explanatory notification banner.
- **Invalid Route / Non-Existent Class:** Navigate directly to `/classes/999` or `/invalid-url`. The UI displays a friendly message explaining the record is missing with a button to return to the schedule.
- **Empty Filter Results:** Search for `zzz` or combine incompatible filters. The view displays a helpful recovery state with a one-click "Clear all filters" button and suggested alternative classes.

## Simulated Operations & Scope
- **Simulated Booking:** No backend database or real payment processing is connected; the application generates a local booking reference (`PS-####`) and clears the active plan.
- **Mock Data Loading:** Network latency is simulated via `src/api/loadClasses.js` with an asynchronous 400ms delay and configurable error injection.

## Known Limitations
- Text-focused typography and card layouts are used rather than heavy image banners to prioritize fast loading and high contrast.
- Booking confirmation is held in React state and is reset upon page refresh.

## Concept Map
| Concept | File | Implementation Details |
|---|---|---|
| Routing & URL Parameters | `src/App.jsx`, `src/pages/ClassDetailsPage.jsx` | `BrowserRouter`, `<Routes>`, `<Route>`, `useParams` |
| Shared State (Context API) | `src/context/PlanContext.jsx` | `PlanContext`, `PlanProvider`, `usePlan` custom hook |
| Immutable Updates | `src/context/PlanContext.jsx` | `addToPlan`, `removeFromPlan`, `setSpots`, `toggleMat` using array spread and map |
| Async Data Fetching & Cleanup | `src/context/PlanContext.jsx`, `src/api/loadClasses.js` | `useEffect` with cancellation flag, `async/await`, error state handling |
| Browser Storage (`localStorage`) | `src/context/PlanContext.jsx` | Safe JSON parsing, automatic persistence effect, reconciliation on data load |
| Synchronized Query Params | `src/pages/ClassesPage.jsx` | `useSearchParams` for search text, category filter, level filter, and sorting |
| Controlled Form & Validation | `src/components/BookingForm.jsx` | Controlled inputs (`useState`), multi-rule validation, inline accessible error states |
| Business Logic & Pure Functions | `src/rules/bookingRules.js` | `checkSpots`, `checkEligibility`, `calculateTotals` |
| Automated Testing | `tests/bookingRules.test.js` | Node.js built-in test runner (`node:test`, `node:assert/strict`) |
| Responsive Layouts & CSS | `src/styles/main.css` | Hand-authored modern CSS, CSS custom properties, 390px/1280px media queries |
