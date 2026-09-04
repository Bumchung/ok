import { media } from "./image-catalog.mjs";
import { createTripData } from "../stopover-family-trip-2027/create-trip-data.mjs";
import { spec } from "./trip-spec.mjs";

const data = createTripData(spec, media);
export const {
  CHECKED_AT, financeCheckedAt, trip, familyGroups, decisionChecklist, lodgingOptions,
  observedTripComQuotes, tripComCostSummary, airbnbSearch, rentalChecklist, itinerary,
  mealSuggestions, places, diningSpots, budgetModel, fxStrategy, climate, sources, heroImage
} = data;
