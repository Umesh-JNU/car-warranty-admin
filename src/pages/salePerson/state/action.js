
import axiosInstance from "../../../utils/axiosUtil";
import { getError } from "../../../utils/error";

export const create = async (dispatch, token, input) => {
  try {
    dispatch({ type: 'ADD_REQUEST' });
    const { data } = await axiosInstance.post(
      "/api/admin/sale-person", { ...input, role: "sale-person" },
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
  let url = `/api/admin/users/?role=sale-person&keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`;

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
      "Are you sure you want to delete this sale person?\n\nNote: All related task will be deleted."
    ) === true
  ) {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      await axiosInstance.delete(`/api/admin/sale-person/${id}`, {
        headers: { Authorization: token },
      });
      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: getError(error) });
    }
  }
}

export const update = async (dispatch, token, id, info) => {
  console.log("sale person update", { info })
  try {
    dispatch({ type: "UPDATE_REQUEST" });

    await axiosInstance.put(`/api/admin/user/${id}`, info, {
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

    const { data } = await axiosInstance.get(`/api/admin/user/${id}/?task=true`, {
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