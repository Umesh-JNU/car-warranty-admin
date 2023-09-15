import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm, TextInput } from "../../components";
import { uploadImage } from "../../utils/uploadImage";
import { Col, ProgressBar, Row } from "react-bootstrap";
import { toast } from "react-toastify";

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
    // password: "",
    addr: "",
    city: "",
    postcode: "",
    mobile_no: "",
    profile_img: "",

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
    // {
    //   type: "text",
    //   props: {
    //     label: "Password",
    //     name: "password",
    //     required: true,
    //   }
    // },
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

  useEffect(() => {
    if (salePerson && salePerson._id === id) {
      console.log({ salePerson })
      setInfo({
        email: salePerson.email,
        firstname: salePerson.firstname,
        lastname: salePerson.lastname,
        mobile_no: salePerson.mobile_no,
        addr: salePerson.addr.address,
        city: salePerson.addr.city,
        postcode: salePerson.addr.postcode,
        profile_img: salePerson.profile_img
      });
      setPreview(salePerson.profile_img)
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  const resetForm = () => { setInfo(salePersonData); };
  const submitHandler = async (e) => {
    e.preventDefault();

    await update(dispatch, token, id, {
      firstname: info.firstname,
      lastname: info.lastname,
      email: info.email,
      mobile_no: info.mobile_no,
      profile_img: info.profile_img,
      addr: {
        address: info.addr,
        city: info.city,
        postcode: info.postcode
      }
    });
    if (success) {
      resetForm();
      setPreview("");
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
    </EditForm>
  );
}