import axiosInstance from "../utils/axiosUtil";
import { getError } from "../utils/error";

export const login = async (ctxDispatch, dispatch, credentials) => {
  try {
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.post("/api/user/login/?admin=true", credentials);

    console.log("data", data);
    if (data.token) {
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("token", JSON.stringify(data.token));

      dispatch({ type: "FETCH_SUCCESS" });
    }
    else {
      dispatch({ type: "FETCH_FAIL", payload: getError(data) });
    }
  }
  catch (err) {
    dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  }
};

export const clearErrors = async (dispatch) => {
  dispatch({ type: 'CLEAR_ERROR' });
};

export const clearSuccess = async (dispatch) => {
  setTimeout(() => {
    dispatch({ type: 'CLEAR_SUCCESS' });
  }, 2000);
}