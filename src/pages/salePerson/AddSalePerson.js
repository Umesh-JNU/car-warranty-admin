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

  const salePersonData = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    mobile_no: "",
    profile_img: "",
    addr: "",
    city: "",
    postcode: ""
  };
  const salePersonAttr = [
    {
      type: "text",
      props: {
        label: "Firstname",
        name: "firstname",
        required: true,
      }
    },
    {
      type: "text",
      props: {
        label: "Lastname",
        name: "lastname",
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
        label: "Mobile No.",
        name: "mobile_no",
        required: true,
      }
    },
    {
      type: "text",
      props: {
        label: "Password",
        name: "password",
        required: true,
      }
    },
    {
      type: "text",
      props: {
        label: "Address",
        name: "addr",
        required: true,
      }
    },
    {
      type: "text",
      props: {
        label: "City",
        name: "city",
        required: true,
      }
    },
    {
      type: "text",
      props: {
        label: "Postcode",
        name: "postcode",
        required: true,
      }
    }
  ]
  const [info, setInfo] = useState(salePersonData);

  const resetForm = () => {
    setInfo(salePersonData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, {
      firstname: info.firstname,
      lastname: info.lastname,
      email: info.email,
      password: info.password,
      mobile_no: info.mobile_no,
      profile_img: info.profile_img,
      addr: {
        address: info.addr,
        city: info.city,
        postcode: info.postcode
      }
    });
    resetForm();
  };

  useTitle("Create Sale Person");
  return (
    <AddForm
      title="Add Sale Person"
      data={info}
      setData={setInfo}
      inputFieldProps={salePersonAttr}
      submitHandler={submitHandler}
      target="/admin/sale-person"
      successMessage="Sale Person Created Successfully!"
      reducerProps={{ loading, error, success, dispatch }}
    >
      <ToastContainer />
    </AddForm>
  );
}