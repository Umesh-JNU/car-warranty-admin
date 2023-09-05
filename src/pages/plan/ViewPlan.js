import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import EditPlanModel from "./EditPlan";

const keyProps = {
	"Claim": "claim",	"Price": "price",	"Month": "month",	"Level": "level", "Created At": "createdAt", "Last Update": "updatedAt"
};

const ViewPlan = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // plan/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, plan }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useTitle("Plan Details");
  return (
    <ViewCard
      title={"Plan Details"}
      data={plan}
      setModalShow={setModalShow}
      keyProps={keyProps}
      reducerProps={{ error, loading, dispatch }}
    >
      <EditPlanModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {!modalShow && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewPlan;