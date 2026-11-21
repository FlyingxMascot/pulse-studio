# Frontend decisions - Humayun Shahid (24K-2011)

Notes to self: fill the "Problem" and "Evidence" lines only with what I actually saw on a real site. Do not keep text I have not verified.

## 1. Keep filters and selections when I move between pages (interaction / state)
- **Problem:** On REFERENCE SITE URL, I noticed (WRITE WHAT I SAW: e.g. filters reset after opening an item and pressing Back).
- **Decision:** I store search, type, level and sort in the URL query string. Classes the customer picked stay in their plan even if filters hide them, and a message says how many are hidden.
- **Alternative:** Keep filters in component state and reset them on each visit.
- **Reason:** Students compare classes across types. If their place is lost they are likely to give up.
- **Tradeoff:** It needs `useSearchParams` and an extra message, which makes the page a bit more complex.
- **Code location:** `src/pages/ClassesPage.jsx` (`changeFilter`, `hiddenInPlan`)
- **Evidence:** screenshot + steps (filter Yoga, add a class, filter Cardio, see the hidden message).

## 2. Show full price and conditions early (information hierarchy)
- **Problem:** On REFERENCE SITE URL, I noticed (WRITE WHAT I SAW: e.g. fees or cancellation rules only appear at checkout).
- **Decision:** Each card shows price per spot, seats left and the cancellation condition. The details page lists the mat fee, spot limit and group discount. The plan page shows a line-by-line summary.
- **Alternative:** Show only a starting price and explain the rest at checkout.
- **Reason:** Customers see the real cost before committing, so fewer should abandon at the end.
- **Tradeoff:** Cards hold more text, which is tighter on a phone.
- **Code location:** `src/components/ClassCard.jsx`, `src/pages/ClassDetailsPage.jsx`, `src/pages/PlanPage.jsx`
- **Evidence:** screenshots at 390px and 1280px.

## 3. Empty results should give a next step (mobile layout and recovery)
- **Problem:** On REFERENCE SITE URL, I noticed (WRITE WHAT I SAW: e.g. a search with no matches shows an empty area).
- **Decision:** My empty state explains what happened, has a "Clear all filters" button and lists other classes. Controls are at least 44px tall and the plan becomes one column on mobile.
- **Alternative:** Only show "No results".
- **Reason:** The customer can still find something that suits them.
- **Tradeoff:** The suggested classes may not be what they wanted.
- **Code location:** `src/pages/ClassesPage.jsx` (`alternatives`), `src/styles/main.css` (`@media`)
- **Evidence:** screenshot of searching "zzz".
