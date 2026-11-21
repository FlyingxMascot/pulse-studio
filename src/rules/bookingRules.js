// All three operating rules live here as plain functions (no React),
// so the same code is used by the app and by the automated test.

// RULE 1 - Capacity: 1 to 4 spots per class, and never more than the seats left.
export const MIN_SPOTS = 1;
export const MAX_SPOTS_PER_CLASS = 4;

export function checkSpots(spots, seatsLeft) {
  if (!Number.isInteger(spots) || spots < MIN_SPOTS) {
    return { ok: false, message: `Book at least ${MIN_SPOTS} spot.` };
  }
  if (spots > MAX_SPOTS_PER_CLASS) {
    return { ok: false, message: `You can book at most ${MAX_SPOTS_PER_CLASS} spots per class.` };
  }
  if (seatsLeft <= 0) {
    return { ok: false, message: "This class is now full. Remove it or pick another." };
  }
  if (spots > seatsLeft) {
    return { ok: false, message: `Only ${seatsLeft} spot${seatsLeft === 1 ? "" : "s"} left. Lower the number of spots.` };
  }
  return { ok: true, message: "" };
}

// RULE 2 - Eligibility: advanced classes are not open to people who say they are beginners.
export function checkEligibility(classLevel, experience) {
  if (classLevel === "advanced" && experience === "beginner") {
    return { ok: false, message: "Advanced classes need intermediate or advanced experience." };
  }
  return { ok: true, message: "" };
}

// RULE 3 - Pricing: 5 or more spots in one booking get 10% off the class total.
// Mat rental costs Rs 150 per spot and is not discounted.
export const GROUP_DISCOUNT_FROM = 5;
export const GROUP_DISCOUNT_RATE = 0.1;
export const MAT_RENTAL_FEE = 150;

export function calculateTotals(lines) {
  let spots = 0;
  let classTotal = 0;
  let matTotal = 0;
  let minutes = 0;

  for (const line of lines) {
    spots += line.spots;
    classTotal += line.price * line.spots;
    if (line.rentMat) matTotal += MAT_RENTAL_FEE * line.spots;
    minutes += line.durationMin * line.spots;
  }

  const discountApplies = spots >= GROUP_DISCOUNT_FROM;
  const discount = discountApplies ? Math.round(classTotal * GROUP_DISCOUNT_RATE) : 0;

  return {
    spots,
    classTotal,
    matTotal,
    discount,
    total: classTotal - discount + matTotal,
    minutes,
  };
}
