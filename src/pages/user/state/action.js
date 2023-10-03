
import axiosInstance from "../../../utils/axiosUtil";
import { getError } from "../../../utils/error";

export const create = async (dispatch, token, input) => {
  try {
    dispatch({ type: 'ADD_REQUEST' });
    const { data } = await axiosInstance.post(
      "/api/admin/user", input,
      { headers: { Authorization: token } }
    );

    setTimeout(() => {
      dispatch({ type: 'ADD_SUCCESS' });
    }, 1500);
  } catch (err) {
    dispatch({ type: "ADD_FAIL", payload: getError(err) });
  }
};

export const getAll = async (dispatch, token, curPage, resultPerPage, query) => {
  let url = `/api/admin/leads/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`;

  try {
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.get(
      url,
      { headers: { Authorization: token } }
    );
    console.log(data);
    dispatch({ type: "FETCH_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_FAIL", payload: getError(error) });
  }
};

export const del = async (dispatch, token, id) => {
  if (
    window.confirm(
      "Are you sure you want to delete this user?\n\nNote: User's all transactions and purchase will also be deleted."
    ) === true
  ) {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      await axiosInstance.delete(`/api/admin/user/${id}`, {
        headers: { Authorization: token },
      });
      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: getError(error) });
    }
  }
}

export const update = async (dispatch, token, id, userInfo) => {
  try {
    dispatch({ type: "UPDATE_REQUEST" });

    await axiosInstance.put(`/api/admin/user/${id}`, userInfo, {
      headers: { Authorization: token },
    });

    setTimeout(() => {
      dispatch({ type: "UPDATE_SUCCESS" });
    }, 2000);
  } catch (err) {
    dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
  }
};

export const getDetails = async (dispatch, token, id) => {
  // console.log(token, id);
  try {
    dispatch({ type: "FETCH_DETAILS_REQUEST" });

    const { data } = await axiosInstance.get(`/api/admin/user/${id}`, {
      headers: { Authorization: token },
    });

    dispatch({ type: "FETCH_DETAILS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "FETCH_DETAILS_FAIL",
      payload: getError(err),
    });
  }
};