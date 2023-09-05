import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate, useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { CustomSkeleton, useTitle, ViewButton, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import EditSalePersonModel from "./EditSalePerson";
import { Table } from "react-bootstrap";

const keyProps = {
  "Firstname": "firstname", "Lastname": "lastname", "Email": "email", "Mobile No.": "mobile_no", "Created At": "createdAt", "Last Update": "updatedAt"
};

const ViewSalePerson = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // sale-person/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, salePerson }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useTitle("Sale Person Details");
  return (
    <ViewCard
      title={"Sale Person Details"}
      data={salePerson}
      setModalShow={setModalShow}
      keyProps={keyProps}
      reducerProps={{ error, loading, dispatch }}
      isImage={true}
      image_url={salePerson ? salePerson.profile_img : ""}
    >
      <h3 className="my-3">Task List</h3>
      {loading ? <CustomSkeleton resultPerPage={5} column={8} />
        : salePerson.warranties.length ?
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>S. No</th>
                <th>Client Name</th>
                <th>Car Make</th>
                <th>Car Model</th>
                <th>Plan Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salePerson.warranties.map((warranty, i) => (
                <tr key={warranty._id} className="odd">
                  <td className="text-center">{i + 1}</td>
                  <td>{`${warranty.user?.firstname} ${warranty.user?.lastname}`}</td>
                  <td>{warranty.vehicleDetails?.make}</td>
                  <td>{warranty.vehicleDetails?.model}</td>
                  <td>{warranty.plan}</td>
                  <td>{warranty.status}</td>
                  <td>
                    <ViewButton onClick={() => navigate(`/admin/view/warranty/${warranty._id}`)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table> : "No Assigned Task"}
      <EditSalePersonModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {!modalShow && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewSalePerson;