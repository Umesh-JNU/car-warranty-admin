import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm } from "../../components";

export default function AddPlan() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const planData = {
		claim: "",
		price: "",
		month: "",
		level: ""
  };
  const planAttr = [
		{
			type: "number",
			props: {
				label: "Claim",
				name: "claim",
				required: true,
			}
		},
		{
			type: "number",
			props: {
				label: "Price",
				name: "price",
				required: true,
			}
		},
		{
			type: "number",
			props: {
				label: "Month",
				name: "month",
				required: true,
			}
		},
		{				required: true,
			}
		}
  ]
  const [info, setInfo] = useState(planData);

  const resetForm = () => {
    setInfo(planData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };

  useTitle("Create Plan");
  return (
    <AddForm
      title="Add Plan"
      data={info}
      setData={setInfo}
      inputFieldProps={planAttr}
      submitHandler={submitHandler}
      target="/admin/plans"
      successMessage="Plan Created Successfully!"
      reducerProps={{ loading, error, success, dispatch }}
    >
      <ToastContainer />
    </AddForm>
  );
}