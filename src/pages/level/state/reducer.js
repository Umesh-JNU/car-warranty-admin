
export default function levelReducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
    case "FETCH_DETAILS_REQUEST":
    case "ADD_REQUEST":
    case "UPDATE_DETAILS_REQUEST":
      return { ...state, loading: true };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        levels: action.payload.levels,
        levelsCount: action.payload.levelsCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        level: action.payload.level
      };
    case "ADD_SUCCESS":
      return { ...state, loading: false, success: true };
    case "UPDATE_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        level: action.payload.level,
        levels: action.payload.levels
      };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "DELETE_SUCCESS":
      const deletedlevelId = action.payload;
      const updatedlevels = state.levels.filter(level => level.id !== deletedlevelId);
      const updatedlevelsCount = state.levelsCount - 1;
      return {
        ...state,
        levels: updatedlevels,
        levelsCount: updatedlevelsCount,
        loading: false
      };

    case "FETCH_FAIL":
    case "ADD_FAIL":
    case "FETCH_DETAILS_FAIL":
    case "UPDATE_DETAILS_FAIL":
    case "UPDATE_FAIL":
      return { ...state, loading: false, loadingUpdate: false, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};