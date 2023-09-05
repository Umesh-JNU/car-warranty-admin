import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm } from "../../components";

export default function AddUser() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const userData = {
		email: "",
		password: "",
		firstname: "",
		lastname: "",
		mobile_no: "",
		role: "user"
  };
  const userAttr = [
,
,
,
,
,

  ]
  const [info, setInfo] = useState(userData);

  const resetForm = () => {
    setInfo(userData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };

  useTitle("Create User");
  return (
    <AddForm
      title="Add User"
      data={info}
      setData={setInfo}
      inputFieldProps={userAttr}
      submitHandler={submitHandler}
      target="/admin/users"
      successMessage="User Created Successfully!"
      reducerProps={{ loading, error, success, dispatch }}
    >
      <ToastContainer />
    </AddForm>
  );
}