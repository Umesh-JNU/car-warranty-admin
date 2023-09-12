import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import EditEnquiryModel from "./EditEnquiry";

const keyProps = {
	"Fullname": "fullname",	"Email": "email",	"Message": "message",	"Department": "department", "Created At": "createdAt", "Last Update": "updatedAt"
};

const ViewEnquiry = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // enquiry/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, enquiry }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useTitle("Enquiry Details");
  return (
    <ViewCard
      title={"Enquiry Details"}
      data={enquiry}
      setModalShow={setModalShow}
      keyProps={keyProps}
      reducerProps={{ error, loading, dispatch }}
    >
      <EditEnquiryModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {!modalShow && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewEnquiry;