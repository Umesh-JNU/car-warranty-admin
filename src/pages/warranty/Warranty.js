
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { clearErrors, clearSuccess } from "../../states/actions";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Card, Form, InputGroup, Spinner, Table } from 'react-bootstrap'
import { ToastContainer, toast } from "react-toastify";
import {
  MessageBox,
  useTitle,
  MotionDiv,
  CustomTable,
  ViewButton,
  DeleteButton,
  AssignButton,
  SelectInput,
  CustomPagination,
  CustomSkeleton,
} from "../../components";
import reducer from "./state/reducer";
import { getAll, del, updateStatus, update } from "./state/action";
import { toastOptions } from "../../utils/error";
import SalePersonModal from "./SalePersonModal";

const statusObj = {
  'AWAITED': 'Awaited Warranties',
  'PASSED': 'Passed Warranties',
  'ACTIVE': 'Active Warranties',
  'REJECTED': 'Rejected Warranties',
  'TO-BE-EXPIRED': 'Expiring Warranties In 30 Days',
  'EXPIRED': 'Expired Warranties',
};

const ChangeStatus = ({ status, warrantyId, token, dispatch }) => {
  const [searchParams, _] = useSearchParams(document.location.search);
  const sts = searchParams.get('status');

  const options = sts === 'AWAITED' ?
    [
      { "inspection-failed": "Inspection Failed" },
      { "inspection-awaited": "Inspection Awaited" },
      { "inspection-passed": "Inspection Passed" }
    ] :
    sts === 'REJECTED' ?
      [
        { "inspection-failed": "Inspection Failed" }, { "refunded": "Refunded" }
      ] :
      sts === 'PASSED' ?
        [
          { "inspection-passed": "Inspection Passed" },
          // { "order-placed": "Order Placed" },
          { "doc-delivered": "Document Delivered" }
        ]
        : [];

  // const [value, setValue] = useState(status);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const handleStatus = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    await updateStatus(dispatch, token, warrantyId, { status: e.target.value });
    setTimeout(() => {
      setLoadingUpdate(false);
    }, 2000);
  };

  return (
    loadingUpdate ? <Spinner animation="border" size="sm" /> :
      <SelectInput
        placeholder="Change Status"
        options={options}
        // [
        //   { "inspection-failed": "Inspection Failed" },
        //   { "inspection-awaited": "Inspection Awaited" },
        //   { "inspection-passed": "Inspection Passed" },
        //   { "order-placed": "Order Placed" },
        //   { "doc-delivered": "Document Delivered" },
        //   { "refunded": "Refunded" },
        // { "claim-requested": "Claim Requested" },
        // { "claim-inspection": "Claim Inspection" },
        // { "claim-inspection-failed": "Claim Inspection Failed" },
        // { "claim-in-progress": "Claim In-Progress" },
        // { "claim-setteled": "Claim Settled" }
        // ]}
        grpStyle="mb-0"
        onChange={handleStatus}
        value={status}
      />
  );
};

export default function Warranty() {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams(document.location.search);
  const status = searchParams.get('status');
  console.log({ status });

  const { state } = useContext(Store);
  const { userInfo, token } = state;

  // const [role, setRole] = useState(userInfo?.role);
  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [warrantyID, setWarrantyID] = useState();
  const [show, setShow] = useState(false);

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, loadingUpdate, error, success, warranties, warrantyCount }, dispatch] =
    useReducer(reducer, {
      loading: true,
      loadingUpdate: false,
      error: "",
    });

  console.log({ warranties })
  const deleteWarranty = async (id) => {
    await del(dispatch, token, id);
  };

  useEffect(() => {
    const fetchData = async () => {
      // const isSalePerson = role === 'sale-person';
      // await getAll(dispatch, token, curPage, resultPerPage, searchInput, isSalePerson);
      await getAll(dispatch, token, curPage, resultPerPage, searchInput, status);
    }
    fetchData();
  }, [token, curPage, resultPerPage, searchInput, status]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error]);

  const numOfPages = Math.ceil(warrantyCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  // console.log("nuofPage", numOfPages, resultPerPage);

  // const column = role === 'admin' ? [
  //   "S. No",
  //   "Client Name",
  //   "Reg. No.",
  //   "Car Make",
  //   "Car Model",
  //   "Plan Type",
  //   "Sale Person",
  //   "Status",
  //   "Actions"
  // ] : [
  //   "S.No",
  //   "Client Name",
  //   "Reg. No.",
  //   "Plan",
  //   "Assigned Date",
  //   "Mobile No.",
  //   "Status",
  //   "Actions"
  // ];

  const column = [
    "S. No",
    "Client Name",
    "Reg. No.",
    "Car Make",
    "Car Model",
    "Plan Type",
    // "Sale Person",
    "Actions"
  ];

  if (status === 'AWAITED' || status === 'REJECTED' || status === 'PASSED')
    column.splice(6, 0, 'Status');

  // useTitle(role === 'admin' ? "Warranty Table" : "My Tasks");
  useTitle("All Tasks");
  return (
    <MotionDiv>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Card>
          <Card.Header>
            {/* isTitle="true" */}
            {/* title="Users" */}
            {/* <div className="float-end d-flex align-items-center">
              <p className="p-bold m-0 me-3">Filter by Plan</p>
              <Form.Group controlId="plan">
                <Form.Select
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    curPageHandler(1);
                  }}
                  aria-label="Default select example"
                >
                  <option value={""}>All</option>
                  <option value={"safe"}>Safe</option>
                  <option value={"secure"}>Secure</option>
                  <option value={"supreme"}>Supreme</option>
                </Form.Select>
              </Form.Group>
            </div> */}
            <h3 className="mb-0">{`${statusObj[status]}`}</h3>
          </Card.Header>
          <Card.Body>
            <Table responsive striped bordered hover>
              <thead>
                <tr>{column.map((col) => <th key={col}>{col}</th>)}</tr>
              </thead>
              <tbody>
                {loading ? (
                  <CustomSkeleton resultPerPage={resultPerPage} column={column.length} />
                ) : (
                  warranties &&
                  warranties.map((warranty, i) => (
                    <tr key={warranty._id} className="odd">
                      <td className="text-center">{skip + i + 1}</td>
                      <td>{`${warranty.user?.firstname} ${warranty.user?.lastname}`}</td>
                      <td>{warranty.vehicleDetails?.reg_num}</td>
                      <td>{warranty.vehicleDetails?.make}</td>
                      <td>{warranty.vehicleDetails?.model}</td>
                      <td>{warranty.plan?.level?.level}</td>
                      {/* <td>{warranty.salePerson ? `${warranty.salePerson.firstname} ${warranty.salePerson.lastname}` : "Not Assigned"}</td> */}
                      {(status === 'AWAITED' || status === 'REJECTED' || status === 'PASSED') &&
                        <td>
                          <ChangeStatus
                            status={warranty.status.value}
                            warrantyId={warranty._id}
                            token={token}
                            success={success}
                            loading={loadingUpdate}
                            dispatch={dispatch}
                          />
                        </td>}
                      {/* <td>{warranty.status}</td> */}
                      <td>
                        {/* <AssignButton onClick={() => { setShow(true); setWarrantyID(warranty._id); }} /> */}
                        <ViewButton onClick={() => navigate(`/admin/view/warranty/${warranty._id}`)} />
                        {['AWAITED', 'REJECTED', 'EXPIRED'].includes(status) && <DeleteButton onClick={() => deleteWarranty(warranty._id)} />}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
          <Card.Footer>
            <div className="float-start d-flex align-items-center mt-3">
              <p className="p-bold m-0 me-3">Number of Row</p>
              <Form.Group controlId="resultPerPage">
                <Form.Select
                  value={resultPerPage}
                  onChange={(e) => {
                    setResultPerPage(e.target.value);
                    curPageHandler(1);
                  }}
                  aria-label="Default select example"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </Form.Select>
              </Form.Group>
            </div>
            {numOfPages > 0 && (
              <CustomPagination
                pages={numOfPages}
                pageHandler={curPageHandler}
                curPage={curPage}
              />
            )}
          </Card.Footer>
        </Card>

      )}

      {/* {
        role === 'admin' && <SalePersonModal
          show={show}
          handleClose={() => setShow(false)}
          warrantyID={warrantyID}
          token={token}
          success={success} loading={loadingUpdate} dispatch={dispatch}
        />
      } */}
      {!show && <ToastContainer />}
    </MotionDiv >
  );
}
