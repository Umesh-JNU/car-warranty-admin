import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm } from "../../components";

export default function EditPlanModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // plan/:id

  const [{ loading, error, loadingUpdate, plan, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const planData = {
		claim: "",
		price: "",
		month: "",
		level: ""
  };
  const planAttr = [
		{
			type: "number",
			props: {
				label: "Claim",
				name: "claim",
				required: true,
			}
		},
		{
			type: "number",
			props: {
				label: "Price",
				name: "price",
				required: true,
			}
		},
		{
			type: "number",
			props: {
				label: "Month",
				name: "month",
				required: true,
			}
		},
		{				required: true,
			}
		}
  ]
  const [info, setInfo] = useState(planData);

  useEffect(() => {
    if (plan && plan._id === id) {
      console.log({ plan })
      setInfo({
				claim: plan.claim,
				price: plan.price,
				month: plan.month,
				level: plan.level
      });
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  const resetForm = () => { setInfo(planData); };
  const submitHandler = async (e) => {
    e.preventDefault();

    await update(dispatch, token, id, info);
    if (success) {
      resetForm();
    }
  };

  return (
    <EditForm
      {...props}
      title="Edit Plan"
      data={info}
      setData={setInfo}
      inputFieldProps={planAttr}
      submitHandler={submitHandler}
      target="/admin/plans"
      successMessage="Plan Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    />
  );
}