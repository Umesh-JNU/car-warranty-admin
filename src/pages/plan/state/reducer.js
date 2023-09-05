
export default function planReducer(state, action) {
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
        plans: action.payload.plans,
        plansCount: action.payload.plansCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        plan: action.payload.plan
      };
    case "ADD_SUCCESS":
      return { ...state, loading: false, success: true };
    case "UPDATE_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        plan: action.payload.plan,
        plans: action.payload.plans
      };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "DELETE_SUCCESS":
      const deletedplanId = action.payload;
      const updatedplans = state.plans.filter(plan => plan.id !== deletedplanId);
      const updatedplansCount = state.plansCount - 1;
      return {
        ...state,
        plans: updatedplans,
        plansCount: updatedplansCount,
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