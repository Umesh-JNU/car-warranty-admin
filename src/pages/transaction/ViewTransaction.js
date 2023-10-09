import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails, refund } from "./state/action";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { getError, toastOptions } from "../../utils/error";
import { clearErrors } from "../../states/actions";
// import EditTransactionModel from "./EditTransaction";

const keyProps = {
  "Plan": "plan", "Amount": "amount", "Status": "status", "Warranty": "warranty", "Method": "method", "Created At": "createdAt", "Last Update": "updatedAt"
};

const Details = ({ title, loading, data, detailKey, fields }) => {
  const keyList = Object.entries(fields);

  console.log({ loading, data, detailKey, fields })
  return (
    <>
      <u><h4 className="mt-3">{title}</h4></u>
      <Row>
        {keyList && keyList.map(([k, attr]) => {
          console.log({ k, attr })
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

const RefundComp = ({ status, handler, loading }) => {
  switch (status) {
    case "refunded": return "Refunded"
    case "pending": return "Refund Processing"
    default:
      return <Button onClick={handler}>
        {loading ? <Spinner animation="border" size="sm" /> : "Click to Refund"}
      </Button>
  }
}

const ViewTransaction = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // transaction/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, transaction }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  console.log({ transaction })
  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  // const refundHandler = async () => {
  //   await refund(dispatch, token, id, { paypalID: transaction?.paypalID });
  // };

  useTitle("Transaction Details");
  return (
    <ViewCard
      title={"Transaction Details"}
      data={transaction && { ...transaction, warranty: transaction.warranty._id, status: transaction.warranty?.status?.value === 'refunded' ? 'refunded' : transaction.status }}
      setModalShow={setModalShow}
      keyProps={keyProps}
      reducerProps={{ error, loading, dispatch }}
      isEdit={false}
    >
      <Details
        title="User Details"
        loading={loading}
        data={transaction}
        detailKey="user"
        fields={{ "Email": "email", "Firstname": "firstname", "Lastname": "lastname", "Mobile No.": "mobile_no" }}
      />

      {/* <u><h4 className="mt-3">Refund</h4></u>
      {transaction?.warranty?.status === "inspection-failed"
        ? <RefundComp status={transaction?.status} handler={refundHandler} loading={loading}/>
        : <><Button disabled>Click to Refund</Button>
          // <span>Warranty is not rejected.</span>
        </>
      } */}
      {/* <EditTransactionModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      /> */}
      {!modalShow && <ToastContainer />}
    </ViewCard >
  );
};

export default ViewTransaction;