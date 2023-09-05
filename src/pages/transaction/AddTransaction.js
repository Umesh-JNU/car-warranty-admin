import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm } from "../../components";

export default function AddTransaction() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const transactionData = {
		plan: "",
		amount: "",
		status: "pending",
		warranty: ""
  };
  const transactionAttr = [
,
,
,

  ]
  const [info, setInfo] = useState(transactionData);

  const resetForm = () => {
    setInfo(transactionData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };

  useTitle("Create Transaction");
  return (
    <AddForm
      title="Add Transaction"
      data={info}
      setData={setInfo}
      inputFieldProps={transactionAttr}
      submitHandler={submitHandler}
      target="/admin/transactions"
      successMessage="Transaction Created Successfully!"
      reducerProps={{ loading, error, success, dispatch }}
    >
      <ToastContainer />
    </AddForm>
  );
}