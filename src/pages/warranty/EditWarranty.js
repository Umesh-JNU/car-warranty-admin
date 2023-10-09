import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams, useSearchParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm, SelectInput, TextInput } from "../../components";
import { Col, Row } from "react-bootstrap";

export default function EditWarrantyModel(props) {
  const { state } = useContext(Store);
  const { userInfo, token } = state;
  const { id } = useParams();  // warranty/:id

  const [searchParams, _] = useSearchParams(document.location.search);
  const status = searchParams.get('status');
  console.log({ status });

  const [role, setRole] = useState(userInfo?.role);
  const [{ loading, error, loadingUpdate, warranty, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const warrantyData = {
    start_date: "",
    status: "inspection-awaited",
    vehicleDetails: "",
  };
  const warrantyAttr = [
    {
      type: "text",
      props: {
        type: "date",
        label: "Plan Start Date",
        name: "start_date",
        required: true,
      }
    },
    {
      type: "select",
      col: 12,
      props: {
        label: "Status",
        name: "status",
        // value: warranty && warranty.status.value,
        placeholder: "Select Status",
        options: [
          { "inspection-failed": "Inspection Failed" },
          { "inspection-awaited": "Inspection Awaited" },
          { "inspection-passed": "Inspection Passed" },
          { "order-placed": "Order Placed" },
          { "doc-delivered": "Document Delivered" },
          // { "claim-requested": "Claim Requested" },
          // { "claim-inspection": "Claim Inspection" },
          // { "claim-inspection-failed": "Claim Inspection Failed" },
          // { "claim-in-progress": "Claim In-Progress" },
          // { "claim-setteled": "Claim Settled" }
        ]
      }
    }
  ]
  const [info, setInfo] = useState(warrantyData);

  const handleInput = (e) => {
    setInfo({ ...info, vehicleDetails: { ...info.vehicleDetails, [e.target.name]: e.target.value } });
  }

  useEffect(() => {
    if (warranty && warranty._id === id) {
      console.log({ warranty })
      setInfo({
        start_date: new Date(warranty.start_date).toISOString().slice(0, 10),
        status: warranty.status.value,
        vehicleDetails: {
          ...warranty.vehicleDetails,
          date_first_reg: new Date(warranty.vehicleDetails.date_first_reg).toISOString().slice(0, 10)
        },
      });
    }

    (async () => {
      const isSalePerson = role === 'sale-person';
      await getDetails(dispatch, token, id, isSalePerson);
    })();
  }, [id, props.show]);

  const resetForm = () => { setInfo(warrantyData); };
  const submitHandler = async (e) => {
    e.preventDefault();

    await update(dispatch, token, id, info);
    console.log({ success })

    if (success) resetForm();
  };

  return (
    <EditForm
      {...props}
      title="Edit Warranty"
      data={info}
      setData={setInfo}
      inputFieldProps={warrantyAttr}
      submitHandler={submitHandler}
      // target={role === 'admin' ? `/admin/warranty/?status=${status}` : "/sale-person/tasks"}
      successMessage="Warranty Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    >
      <Row>
        <Col md={6}>
          <TextInput
            value={info?.vehicleDetails?.make}
            required="true"
            label="Make"
            name="make"
            onChange={handleInput}
          />
        </Col>
        <Col md={6}>
          <TextInput
            value={info?.vehicleDetails?.model}
            required="true"
            label="Model"
            name="model"
            onChange={handleInput}
          />
        </Col>
        <Col md={6}>
          <TextInput
            value={info?.vehicleDetails?.bhp}
            type="number"
            required="true"
            label="BHP"
            name="bhp"
            onChange={handleInput}
          />
        </Col>
        <Col md={6}>
          <TextInput
            value={info?.vehicleDetails?.date_first_reg}
            type="date"
            required="true"
            label="Date First Registration"
            name="date_first_reg"
            onChange={handleInput}
          />
        </Col>
        <Col md={6}>
          <SelectInput
            value={info?.vehicleDetails?.drive_type}
            required="true"
            label="Drive Type"
            name="drive_type"
            options={[{ "4x4": "4x4" }, { "4x2": "4x2" }]}
            onChange={handleInput}
          />
        </Col>
        <Col md={6}>
          <TextInput
            value={info?.vehicleDetails?.fuel_type}
            required="true"
            label="Fuel Type"
            name="fuel_type"
            onChange={handleInput}
          />
        </Col>
        <Col md={6}>
          <TextInput
            value={info?.vehicleDetails?.mileage}
            type="number"
            required="true"
            label="Mileage"
            name="mileage"
            onChange={handleInput}
          />
        </Col>
        <Col md={6}>
          <TextInput
            value={info?.vehicleDetails?.size}
            type="number"
            required="true"
            label="Engine Size"
            name="size"
            onChange={handleInput}
          />
        </Col>
      </Row>
    </EditForm>
  );
}