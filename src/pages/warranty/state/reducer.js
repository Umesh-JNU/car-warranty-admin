
export default function warrantyReducer(state, action) {
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
        warranties: action.payload.warranties,
        warrantyCount: action.payload.warrantyCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      console.log({ warranty1: action.payload })
      return {
        ...state,
        loading: false,
        warranty: action.payload.warranty
      };
    case "ADD_SUCCESS":
      return { ...state, loading: false, success: true };
    case "UPDATE_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        warranty: action.payload.warranty,
        warranties: action.payload.warranties
      };
    case "UPDATE_STATUS":
      console.log({ payload: action.payload })
      var { warrantyId, newStatus, statusType } = action.payload;
      if (statusType === 'PASSED') {
        var updatedwarrantyList = state.warranties.map(warranty => {
          if (warranty._id === warrantyId) {
            return { ...warranty, status: { ...warranty.status, value: newStatus } };
          }
          return warranty;
        });
      }
      else {
        var updatedwarrantyList = state.warranties.filter(warranty => warranty._id !== warrantyId);
      }

      console.log({ updatedwarrantyList })
      return {
        ...state,
        warranties: updatedwarrantyList,
      };

    case "UPDATE_SALE_PERSON":
      console.log({ payload: action.payload })
      var { warrantyId, salePerson } = action.payload;
      var updatedwarrantyList = state.warranties.map(warranty => {
        if (warranty._id === warrantyId)
          return { ...warranty, salePerson };
        return warranty
      });

      console.log({ updatedwarrantyList })
      return {
        ...state,
        warranties: updatedwarrantyList,
        loadingUpdate: false, success: true
      };

    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "DELETE_SUCCESS":
      const deletedwarrantyId = action.payload;
      const updatedwarranty = state.warranties.filter(warranty => warranty._id !== deletedwarrantyId);
      const updatedwarrantyCount = state.warrantyCount - 1;
      return {
        ...state,
        warranties: updatedwarranty,
        warrantyCount: updatedwarrantyCount,
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

    case 'CLEAR_SUCCESS':
      return { ...state, success: false };

    default:
      return state;
  }
};