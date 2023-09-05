
export default function transactionReducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
    case "FETCH_DETAILS_REQUEST":
    case "ADD_REQUEST":
      return { ...state, loading: true };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        salePersons: action.payload.users,
        salePersonsCount: action.payload.usersCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        salePerson: action.payload.user
      };
    case "ADD_SUCCESS":
      return { ...state, loading: false, success: true };
    
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "DELETE_SUCCESS":
      const deleteId = action.payload;
      const updatedsalePersons = state.salePersons.filter(sp => sp._id !== deleteId);
      const updatedsalePersonsCount = state.salePersonsCount - 1;
      return {
        ...state,
        salePersons: updatedsalePersons,
        salePersonsCount: updatedsalePersonsCount,
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