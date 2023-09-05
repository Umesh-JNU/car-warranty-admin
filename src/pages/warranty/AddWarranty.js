import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm } from "../../components";

export default function AddWarranty() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const warrantyData = {
		vehicleDetails: "",
		userDetails: "",
		address: "",
		start_date: "",
		vehicleInfo: "",
		user: "",
		transaction: "",
		plan: "",
		status: "awaited"
  };
  const warrantyAttr = [
,
,
,
,
,
,
,
,

  ]
  const [info, setInfo] = useState(warrantyData);

  const resetForm = () => {
    setInfo(warrantyData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };

  useTitle("Create Warranty");
  return (
    <AddForm
      title="Add Warranty"
      data={info}
      setData={setInfo}
      inputFieldProps={warrantyAttr}
      submitHandler={submitHandler}
      target="/admin/warrantys"
      successMessage="Warranty Created Successfully!"
      reducerProps={{ loading, error, success, dispatch }}
    >
      <ToastContainer />
    </AddForm>
  );
}