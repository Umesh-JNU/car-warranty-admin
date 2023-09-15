import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer, toast } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm, TextInput } from "../../components";
import { uploadImage } from "../../utils/uploadImage";
import { ProgressBar } from "react-bootstrap";

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
  const [preview, setPreview] = useState("");
  const handleInput = (e) => {
    setInfo({ ...info, addr: { ...info.addr, [e.target.name]: e.target.value } });
  }

  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const uploadPercentageHandler = (per) => { setUploadPercentage(per); };

  const uploadFileHandler = async (e, type) => {
    if (!e.target.files[0]) {
      // if (!file) {
      setInfo({ ...info, profile_img: null });
      setPreview("");
      return;
    }
    if (e.target.files[0].size > 5000000) {
      toast.warning("Image size is too large. (max size 5MB)", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      setInfo({ ...info, profile_img: null });
      setPreview("");
      return;
    }
    try {
      // if (e.target.files[0]) {
      const location = await uploadImage(
        e.target.files[0],
        // file,
        token,
        uploadPercentageHandler
      );
      if (location.error) {
        throw location.error;
      }

      setInfo({ ...info, profile_img: location });
      setPreview(location);

      setTimeout(() => {
        setUploadPercentage(0);
        setIsUploaded(true);
      }, 1000);
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

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
    setPreview("");
    setUploadPercentage(0);
    setIsUploaded(false);
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
      <TextInput label="Upload Image" type="file" accept="image/*" onChange={(e) => uploadFileHandler(e)} />
      {uploadPercentage > 0 && (
        <ProgressBar
          now={uploadPercentage}
          active
          label={`${uploadPercentage}%`}
        />
      )}
      {preview && <img src={preview} width={100} className="img-fluid" />}
      <ToastContainer />
    </AddForm>
  );
}