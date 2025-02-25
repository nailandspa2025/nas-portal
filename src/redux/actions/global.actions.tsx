export const GLOBAL_TOGGLE_LOADING = "GLOBAL_TOGGLE_LOADING";

export const toggleLoadding = (status: boolean) => {
  return {
    type: GLOBAL_TOGGLE_LOADING,
    status,
  };
};
