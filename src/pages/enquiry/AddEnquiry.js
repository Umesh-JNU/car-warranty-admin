import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm } from "../../components";

export default function AddEnquiry() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const enquiryData = {
		fullname: "",
		email: "",
		message: "",
		department: ""
  };
  const enquiryAttr = [
    {
      type: "text",
      props: {
        label: "Fullname",
        name: "fullname",
        required: true,
      }
    },
    {
      type: "text",
      props: {
        label: "Email",
        name: "email",
        type: "email",
        required: true,
      }
    },
    {
      type: "text",
      props: {
        label: "Department",
        name: "department",
        required: true,
      }
    },
    {
      type: "text",
      col: 12,
      props: {
        label: "Message",
        name: "message",
        as: "textarea",
        rows: 5,
        required: true,
      }
    }
  ]
  const [info, setInfo] = useState(enquiryData);

  const resetForm = () => {
    setInfo(enquiryData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };

  useTitle("Create Enquiry");
  return (
    <AddForm
      title="Add Enquiry"
      data={info}
      setData={setInfo}
      inputFieldProps={enquiryAttr}
      submitHandler={submitHandler}
      target="/admin/enquiry"
      successMessage="Enquiry Created Successfully!"
      reducerProps={{ loading, error, success, dispatch }}
    >
      <ToastContainer />
    </AddForm>
  );
}