const listeners = new Set();

export const subscribeSavingState = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const setSavingState = (state) => {
  for (const fn of listeners) fn(state);
};