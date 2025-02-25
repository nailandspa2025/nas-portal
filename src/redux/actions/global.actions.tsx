export const GLOBAL_TOGGLE_LOADING = "GLOBAL_TOGGLE_LOADING" as const;

export const toggleLoading = (status: boolean) => {
  return {
    type: GLOBAL_TOGGLE_LOADING,
    status,
  };
};
