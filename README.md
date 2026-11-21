# Pulse Studio

**Student:** Humayun Shahid | **Roll no:** 24K-2011 | **Section:** BCY-5C | **Course:** CS4032 Web Programming, Assignment 02

For this assignment I made Pulse Studio, a fictional small-group fitness studio in F-7, Islamabad, aimed at university students. On my site, visitors browse weekly classes, search and filter them, open a class, build a plan, fill in a short form and get a (simulated) booking confirmation.

- GitHub: https://github.com/FlyingxMascot/pulse-studio
- Live site: https://pulse-studio-tau.vercel.app/

## Commands
```
npm install      # install
npm run dev      # development server
npm run build    # production build
npm test         # runs: node --test (booking rule tests)
```

## Routes
| Route | Purpose |
|---|---|
| `/` | Class list with search, filters, sort |
| `/classes/:id` | Class details (invalid id shows a message) |
| `/plan` | Edit selection, see summary, fill form |
| `/confirmation` | Simulated booking result |

## Operating rules (all in `src/rules/bookingRules.js`)
1. **Capacity:** 1 to 4 spots per class and never more than seats left. Shown next to the spots box. 4 is allowed, 5 is blocked.
2. **Eligibility:** advanced classes cannot be booked by someone who chose "Beginner". Error shows under the experience field.
3. **Pricing:** 5 or more spots in a booking get 10% off class prices (mat rental not discounted). 4 spots: no discount, 5 spots: discount.

## Reproducing edge cases
- **Loading failure:** tick "Simulate loading failure" at the bottom of any page, then use "Try again" after unticking it.
- **Changed availability:** add "Spin Sprint" to your plan, press "Make Spin Sprint full", open My plan. The line shows an error and booking is blocked until you remove it.
- **Restored data:** in dev tools run `localStorage.setItem("pulse-studio-plan", '[{"id":999,"spots":2,"rentMat":false}]')` and refresh. The unknown class is removed with a notice.
- **Bad URL:** visit `/classes/abc` or `/nothing-here`.
- **Empty results:** search for `zzz`.

## Simulated parts
In my app, bookings are not sent anywhere and no payment is taken. Class loading is a fake delay in `src/api/loadClasses.js`.

## Known limitations
- I used text-only cards and did not add images.
- I chose to clear the confirmation on refresh, so it is lost if the page reloads.

## Concept map
| Concept | File | Where |
|---|---|---|
| Routing + URL params | `src/App.jsx`, `ClassDetailsPage.jsx` | `Routes`, `useParams` |
| Shared state (context) | `src/context/PlanContext.jsx` | `PlanProvider` |
| Functional updates, immutable arrays | `PlanContext.jsx` | `addToPlan`, `setSpots`, `toggleMat` |
| Async loading, effect cleanup | `PlanContext.jsx`, `src/api/loadClasses.js` | first `useEffect` |
| localStorage | `PlanContext.jsx` | `readSavedPlan`, save effect |
| Search/filter/sort in URL | `src/pages/ClassesPage.jsx` | `useSearchParams` |
| Controlled form + validation | `src/components/BookingForm.jsx` | `validate`, `handleChange` |
| Business rules + tests | `src/rules/bookingRules.js`, `tests/bookingRules.test.js` | `checkSpots` etc. |
| Derived values | `PlanPage.jsx`, `bookingRules.js` | `calculateTotals` |
