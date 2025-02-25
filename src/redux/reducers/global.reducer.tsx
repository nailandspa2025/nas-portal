import { GLOBAL_TOGGLE_LOADING } from "../actions/global.actions";

interface GlobalState {
  status: boolean;
  collapsed: boolean;
  drawerVisible: false;
}

interface GlobalAction {
  type: typeof GLOBAL_TOGGLE_LOADING | "setCollapsed" | "setDrawerVisible";
  status?: boolean;
  collapsed?: boolean;
  drawerVisible?: boolean;
}

const initialState: GlobalState = {
  status: false,
  collapsed: false,
  drawerVisible: false,
};

const globalReducer = (state = initialState, action: GlobalAction) => {
  switch (action.type) {
    case GLOBAL_TOGGLE_LOADING:
      return {
        ...state,
        status: action.status ?? false,
      };

    case "setCollapsed":
      return {
        ...state,
        collapsed: action.collapsed ?? false,
      };
    case "setDrawerVisible":
      return {
        ...state,
        drawerVisible: action.drawerVisible ?? false,
      };

    default:
      return state;
  }
};

export default globalReducer;
