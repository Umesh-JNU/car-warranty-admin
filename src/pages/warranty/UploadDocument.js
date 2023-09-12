import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { update } from "./state/action";
import { EditForm, TextInput } from "../../components";
import { uploadPDF } from "../../utils/uploadImage";
import { Col, ProgressBar, Row } from "react-bootstrap";
import { toast } from "react-toastify";

export default function UploadDocument(props) {
  const { state } = useContext(Store);
  const { userInfo, token } = state;
  const { id } = useParams();  // warranty/:id

  const [{ loading, error, loadingUpdate, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const [desc, setDesc] = useState("");
  const [doc, setDoc] = useState("");

  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const uploadPercentageHandler = (per) => { setUploadPercentage(per); };

  const uploadFileHandler = async (e, type) => {
    if (!e.target.files[0]) {
      // if (!file) {
      setDoc("");
      return;
    }
    if (e.target.files[0].size > 5000000) {
      toast.warning("Image size is too large. (max size 5MB)", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      setDoc("");
      return;
    }
    try {
      // if (e.target.files[0]) {
      const location = await uploadPDF(
        e.target.files[0],
        // file,
        token,
        uploadPercentageHandler
      );
      if (location.error) {
        throw location.error;
      }

      setDoc(location);
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
    setUploadPercentage(0);
    setDesc("");
  }, [id, props.show]);

  const resetForm = () => { setDoc(""); setDesc(""); };
  const submitHandler = async (e) => {
    e.preventDefault();

    await update(dispatch, token, id, { document: { url: doc, desc } }, userInfo?.role === 'sale-person');
    console.log({ success })

    if (success) resetForm();
  };

  return (
    <EditForm
      {...props}
      title="Edit Warranty"
      data={{}}
      setData={() => { }}
      inputFieldProps={[]}
      submitHandler={submitHandler}
      target={''}
      successMessage="Warranty Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    >
      <Row>
        <Col>
          <TextInput
            value={desc}
            required="true"
            label="Description"
            onChange={(e) => setDesc(e.target.value)}
          />
        </Col>
        <Col>
          <TextInput label="Upload Image" type="file" accept=".pdf" onChange={(e) => uploadFileHandler(e)} />
          {!isUploaded && uploadPercentage > 0 && (
            <ProgressBar
              now={uploadPercentage}
              active
              label={`${uploadPercentage}%`}
            />
          )}
        </Col>
      </Row>
    </EditForm>
  );
}