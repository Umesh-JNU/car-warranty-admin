import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import EditUserModel from "./EditUser";
import { Col, Row } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";

const keyProps = {
	"Email": "email",	"Firstname": "firstname",	"Lastname": "lastname",	"Mobile No.": "mobile_no",	"Role": "role", "Created At": "createdAt", "Last Update": "updatedAt"
};

const Details = ({ title, loading, data, detailKey, fields }) => {
  const keyList = Object.entries(fields);

  // console.log({ loading, data, detailKey, fields })
  return (
    <>
      <u><h4 className="mt-3">{title}</h4></u>
      <Row>
        {keyList && keyList.map(([k, attr]) => {
          // console.log({ k, attr })
          return (
            <Col key={k} md={4}>
              <p className="mb-0">
                <strong>{k}</strong>
              </p>
              <p>{loading ? <Skeleton /> : data[detailKey][attr]}</p>
            </Col>
          )
        })}
      </Row>
    </>
  )
};

const ViewUser = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  console.log({error, user})
  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useTitle("User Details");
  return (
    <ViewCard
      title={"User Details"}
      data={user}
      setModalShow={setModalShow}
      keyProps={keyProps}
      isImage={true}
      image_url={user ? user.profile_img : ""}
      reducerProps={{ error, loading, dispatch }}
    >
      <Details
        title="Address Details"
        loading={loading}
        data={user}
        detailKey="addr"
        fields={{ "Address": "address", "City": "city", "Postcode": "postcode" }}
      />
      <EditUserModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {!modalShow && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewUser;