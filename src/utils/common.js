export const getApiActionType = (ACTIONS) => {
  const ACTION_TYPES = {};
  Object.values(ACTIONS).forEach((action) => {
    ACTION_TYPES[action] = [action, `${action}_SUCCESS`, `${action}_FAILURE`];
  });
  return ACTION_TYPES;
};
