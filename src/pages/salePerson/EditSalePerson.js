import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm } from "../../components";

export default function EditTransactionModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // sale-person/:id

  const [{ loading, error, loadingUpdate, salePerson, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const salePersonData = {
    firstname: "",
    lastname: "",
    email: "",
    mobile_no: "",
    profile_img: ""
  };

  const salePersonAttr = [
    {
      type: "text",
      props: {
        label: "Firstname",
        name: "firstname",
      }
    },
    {
      type: "text",
      props: {
        label: "Lastname",
        name: "lastname"
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
      }
    }
  ]
  const [info, setInfo] = useState(salePersonData);

  useEffect(() => {
    if (salePerson && salePerson._id === id) {
      console.log({ salePerson })
      setInfo({
        firstname: salePerson.firstname,
        lastname: salePerson.lastname,
        email: salePerson.email,
        mobile_no: salePerson.mobile_no,
        profile_img: salePerson.profile_img
      });
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  const resetForm = () => { setInfo(salePersonData); };
  const submitHandler = async (e) => {
    e.preventDefault();

    await update(dispatch, token, id, info);
    if (success) {
      resetForm();
    }
  };

  return (
    <EditForm
      {...props}
      title="Edit Sale Person"
      data={info}
      setData={setInfo}
      inputFieldProps={salePersonAttr}
      submitHandler={submitHandler}
      target="/admin/sale-person"
      successMessage="Sale Person Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    />
  );
}