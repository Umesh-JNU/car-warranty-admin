
import axiosInstance from "../../../utils/axiosUtil";
import { getError } from "../../../utils/error";

export const create = async (dispatch, token, input) => {
  try {
    dispatch({ type: 'ADD_REQUEST' });
    const { data } = await axiosInstance.post(
      "/api/admin/warranty", input,
      { headers: { Authorization: token } }
    );

    setTimeout(() => {
      dispatch({ type: 'ADD_SUCCESS' });
    }, 1500);
  } catch (err) {
    dispatch({ type: "ADD_FAIL", payload: getError(err) });
  }
};

export const getAll = async (dispatch, token, curPage, resultPerPage, query, status) => {
  // let url = `/api/${isSalePerson ? 'sale-person' : 'admin'}/warranty/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`;
  let url = `/api/admin/warranty/?status=${status}&keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`;
  console.log({ url });
  try {
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.get(
      url,
      { headers: { Authorization: token } }
    );
    console.log({ data });
    dispatch({ type: "FETCH_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_FAIL", payload: getError(error) });
  }
};

export const del = async (dispatch, token, id) => {
  if (
    window.confirm(
      "Are you sure you want to delete this warranty?"
    ) === true
  ) {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      await axiosInstance.delete(`/api/admin/warranty/${id}`, {
        headers: { Authorization: token },
      });
      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: getError(error) });
    }
  }
}

export const update = async (dispatch, token, id, warrantyInfo, isSalePerson = false) => {
  const url = `/api/${isSalePerson ? 'sale-person' : 'admin'}/warranty/${id}`;
  try {
    dispatch({ type: "UPDATE_REQUEST" });

    await axiosInstance.put(url, warrantyInfo, {
      headers: { Authorization: token },
    });

    setTimeout(() => {
      dispatch({ type: "UPDATE_SUCCESS" });
    }, 2000);
  } catch (err) {
    dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
  }
};

export const updateStatus = async (dispatch, token, id, warrantyInfo, statusType) => {
  console.log({ warrantyInfo });
  // const url = `/api/sale-person/warranty/${id}`;
  const url = `/api/admin/warranty/${id}`;
  try {
    dispatch({ type: "UPDATE_REQUEST" });

    await axiosInstance.put(url, warrantyInfo, {
      headers: { Authorization: token },
    });

    setTimeout(() => {
      dispatch({
        type: "UPDATE_STATUS",
        payload: {
          warrantyId: id,
          newStatus: warrantyInfo.status,
          statusType
        }
      })
    }, 2000);
  } catch (err) {
    dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
  }
};

export const updateSalePerson = async (dispatch, token, id, salePerson) => {
  console.log({ salePerson });
  try {
    dispatch({ type: "UPDATE_REQUEST" });

    await axiosInstance.put(`/api/admin/warranty/${id}`, { salePerson: salePerson._id }, {
      headers: { Authorization: token },
    });

    setTimeout(() => {
      dispatch({
        type: "UPDATE_SALE_PERSON", payload: {
          warrantyId: id,
          salePerson
        }
      });
    }, 2000);
  } catch (err) {
    dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
  }
};

export const getDetails = async (dispatch, token, id, isSalePerson = false) => {
  const url = `/api/${isSalePerson ? 'sale-person' : 'admin'}/warranty/${id}`
  // console.log(token, id);
  try {
    dispatch({ type: "FETCH_DETAILS_REQUEST" });

    const { data } = await axiosInstance.get(url, {
      headers: { Authorization: token },
    });

    console.log({ data })
    dispatch({ type: "FETCH_DETAILS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "FETCH_DETAILS_FAIL",
      payload: getError(err),
    });
  }
};