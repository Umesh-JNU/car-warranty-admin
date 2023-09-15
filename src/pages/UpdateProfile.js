import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../states/store";
import { reducer } from "../states/reducers";
import { getProfile, updateProfile } from "../states/actions";
import { EditForm, TextInput } from "../components";
import { uploadImage } from "../utils/uploadImage";
import { Col, ProgressBar, Row } from "react-bootstrap";
import { toast } from "react-toastify";

export default function EditUserModel(props) {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, loadingUpdate, data: user, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const userData = {
    email: "",
    profile_img: "",
    firstname: "",
    lastname: "",
    mobile_no: "",
    addr: "",
  };
  const userAttr = [
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
        name: "lastname",
      }
    },
    {
      type: "text",
      props: {
        label: "Email",
        name: "email",
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
  const [info, setInfo] = useState(userData);
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
      return;
    }
    if (e.target.files[0].size > 5000000) {
      toast.warning("Image size is too large. (max size 5MB)", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      setInfo({ ...info, profile_img: null });
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
    if (user) {
      console.log({ user })
      setInfo({
        email: user.email,
        // password: user.password,
        firstname: user.firstname,
        lastname: user.lastname,
        mobile_no: user.mobile_no,
        addr: user.addr,
        profile_img: user.profile_img
      });
    }

    (async () => {
      await getProfile(dispatch, token);
    })();
  }, [token, props.show]);

  const resetForm = () => { setInfo(userData); };
  const submitHandler = async (e) => {
    e.preventDefault();

    await updateProfile(dispatch, token, info);
    if (success) {
      resetForm();
    }
  };

  return (
    <EditForm
      {...props}
      title="Edit User"
      data={info}
      setData={setInfo}
      inputFieldProps={userAttr}
      submitHandler={submitHandler}
      target="/admin/users"
      successMessage="User Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    >
      <Row>
        <Col md={12}>
          <TextInput
            value={info?.addr?.address}
            required="true"
            label="Address"
            name="address"
            onChange={handleInput}
          />
        </Col>
        <Col md={6}>
          <TextInput
            value={info?.addr?.city}
            required="true"
            label="City"
            name="city"
            onChange={handleInput}
          />
        </Col>
        <Col md={6}>
          <TextInput
            value={info?.addr?.postcode}
            required="true"
            label="Postcode"
            name="postcode"
            onChange={handleInput}
          />
        </Col>
      </Row>
      <>
        <TextInput label="Upload Image" type="file" accept="image/*" onChange={(e) => uploadFileHandler(e)} />
        {uploadPercentage > 0 && (
          <ProgressBar
            now={uploadPercentage}
            active
            label={`${uploadPercentage}%`}
          />
        )}
      </>
    </EditForm>
  );
}