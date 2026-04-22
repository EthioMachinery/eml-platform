export const matchingEngine = (machines: any[], userPreferences: any) => {
  return machines.filter((m) => {
    if (userPreferences.category && m.category !== userPreferences.category) {
      return false;
    }
    if (userPreferences.location && m.location !== userPreferences.location) {
      return false;
    }
    if (userPreferences.maxPrice && m.price > userPreferences.maxPrice) {
      return false;
    }
    return true;
  });
};