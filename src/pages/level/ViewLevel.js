import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import EditLevelModel from "./EditLevel";

const keyProps = {
	"Level": "level",	"Max Age": "max_age",	"Max Mileage": "max_mileage", "Created At": "createdAt", "Last Update": "updatedAt"
};

const ViewLevel = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // level/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, level }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useTitle("Level Details");
  return (
    <ViewCard
      title={"Level Details"}
      data={level}
      setModalShow={setModalShow}
      keyProps={keyProps}
      reducerProps={{ error, loading, dispatch }}
    >
      <EditLevelModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {!modalShow && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewLevel;