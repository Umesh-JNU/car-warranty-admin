import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import { Button, Col, Row, Table } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { getDateTime } from "../../utils/function";
import EditWarrantyModel from "./EditWarranty";
import UploadDocument from "./UploadDocument";

const boolComp = (val) => {
  return val ? <FaCheck className="green" /> : <ImCross className="red" />;
}

const isDate = (date) => {
  return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

const dynamicComp = (val) => {
  const dataType = typeof val;
  // console.log({ dataType })
  switch (dataType) {
    case "number": return val;
    case "boolean": return boolComp(val);
    default:
      // console.log({ val });
      const res = val ? (isDate(val) ? getDateTime(val).slice(0, 10) : val) : "---";
      // console.log({ res });
      return res;
  }
};

const keyProps = {
  "Plan Start Date": "start_date", "Status": "status", "Created At": "createdAt", "Last Update": "updatedAt"
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
              <p>{loading ? <Skeleton /> : dynamicComp(data[detailKey][attr])}</p>
            </Col>
          )
        })}
      </Row>
    </>
  )
};

const ViewWarranty = () => {
  const { state } = useContext(Store);
  const { userInfo, token } = state;
  const { id } = useParams(); // warranty/:id

  const [role, setRole] = useState(userInfo?.role);
  const [modalShow, setModalShow] = useState(false);
  const [docShow, setDocShow] = useState(false);
  const [{ loading, error, warranty }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    (async () => {
      const isSalePerson = role === 'sale-person';
      await getDetails(dispatch, token, id, isSalePerson);
    })();
  }, [token, id]);

  console.log({ warranty });

  useTitle("Warranty Details");
  return (
    <ViewCard
      title={"Warranty Details"}
      data={warranty}
      setModalShow={setModalShow}
      keyProps={keyProps}
      reducerProps={{ error, loading, dispatch }}
      isEdit="true"
    >
      <Details
        title="Vehicle Details"
        loading={loading}
        data={warranty}
        detailKey="vehicleDetails"
        fields={{ "Make": "make", "Model": "model", "BHP": "bhp", "DateFirstReg": "date_first_reg", "Drive Type": "drive_type", "Fuel Type": "fuel_type", "Engine Size": "size" }}
      />
      <Details
        title="User Details"
        loading={loading}
        data={warranty}
        detailKey="user"
        fields={{ "Email": "email", "Firstname": "firstname", "Lastname": "lastname", "Mobile No.": "mobile_no" }}
      />
      <Details
        title="Address"
        loading={loading}
        data={warranty?.user}
        detailKey="addr"
        fields={{ "Address": "address", "City": "city", "Postcode": "postcode" }}
      />
      <Details
        title="Vehicle Information"
        loading={loading}
        data={warranty}
        detailKey="vehicleInfo"
        fields={{ "Purchase Date": "purchase_date", "Service History": "service_history" }}
      />
      <u><h4 className="mt-3">Documents</h4></u>

      <Row>
        <Col md={6}>
          {loading ? <Skeleton count={5} height={35} /> : <Table responsive striped bordered hover>
            <tbody>
              {warranty.documents.map(({ url, desc }, i) =>
                <tr key={url}>
                  <td>{i + 1}</td>
                  <td>
                    <a href={url} target="_blank">{desc}</a>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>}
        </Col>
      </Row>

      {role === 'sale-person' && <div className="my-3">
        <Button variant="secondary" onClick={() => setDocShow(true)}>Upload Document</Button>
      </div>}

      <EditWarrantyModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <UploadDocument
        show={docShow}
        onHide={() => setDocShow(false)}
        reload={async () => await getDetails(dispatch, token, id, role === 'sale-person')}
      />
      {!modalShow && !docShow && <ToastContainer />}
    </ViewCard >
  );
};

export default ViewWarranty;