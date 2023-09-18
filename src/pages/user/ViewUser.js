import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate, useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { CustomSkeleton, useTitle, ViewButton, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import EditUserModel from "./EditUser";
import { Col, Row, Table } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";

const keyProps = {
  "Email": "email", "Firstname": "firstname", "Lastname": "lastname", "Mobile No.": "mobile_no", "Role": "role", "Created At": "createdAt", "Last Update": "updatedAt"
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
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  console.log({ error, user })
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
      <h3 className="my-3">{user?.role === 'sale-person' ? "Tasks" : "Warranties"}</h3>
      {loading ? <CustomSkeleton resultPerPage={5} column={8} />
        : user.warranties.length ?
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>S. No</th>
                <th>Vehicle Reg. No.</th>
                <th>Plan Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {user.warranties.map((warranty, i) => (
                <tr key={warranty._id} className="odd">
                  <td className="text-center">{i + 1}</td>
                  <td>{warranty.vehicleDetails?.reg_num}</td>
                  <td>{warranty.plan}</td>
                  <td>{warranty.amount}</td>
                  <td>{warranty.status}</td>
                  <td>
                    <ViewButton onClick={() => navigate(`/admin/view/warranty/${warranty._id}`)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table> : user?.role === 'sale-person' ? "No Assigned Tasks" : "No Warranties"}
      <EditUserModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {!modalShow && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewUser;