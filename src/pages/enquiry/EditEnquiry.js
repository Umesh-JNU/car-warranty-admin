import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm } from "../../components";

export default function EditEnquiryModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // enquiry/:id

  const [{ loading, error, loadingUpdate, enquiry, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
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

  useEffect(() => {
    if (enquiry && enquiry._id === id) {
      console.log({ enquiry })
      setInfo({
				fullname: enquiry.fullname,
				email: enquiry.email,
				message: enquiry.message,
				department: enquiry.department
      });
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  const resetForm = () => { setInfo(enquiryData); };
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
      title="Edit Enquiry"
      data={info}
      setData={setInfo}
      inputFieldProps={enquiryAttr}
      submitHandler={submitHandler}
      target="/admin/enquiry"
      successMessage="Enquiry Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    />
  );
}