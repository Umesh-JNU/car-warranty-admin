import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm } from "../../components";

export default function AddLevel() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const levelData = {
		level: "",
		max_age: "",
		max_mileage: ""
  };
  const levelAttr = [
		{
			type: "select",
			col: 12,
			props: {
				label: "Level",
				name: "level",
				placeholder: "Select Level",
				options: [{ 'safe': 'Safe' }, { 'secure': 'Secure' }, { 'supreme': 'Supreme' }],
				required: true,
			}
		},
		{
			type: "number",
			props: {
				label: "Max Age",
				name: "max_age",
				required: true,
			}
		},
		{
			type: "number",
			props: {
				label: "Max Mileage",
				name: "max_mileage",
				required: true,
			}
		}
  ]
  const [info, setInfo] = useState(levelData);

  const resetForm = () => {
    setInfo(levelData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };

  useTitle("Create Level");
  return (
    <AddForm
      title="Add Level"
      data={info}
      setData={setInfo}
      inputFieldProps={levelAttr}
      submitHandler={submitHandler}
      target="/admin/levels"
      successMessage="Level Created Successfully!"
      reducerProps={{ loading, error, success, dispatch }}
    >
      <ToastContainer />
    </AddForm>
  );
}