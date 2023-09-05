import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm } from "../../components";

export default function EditTransactionModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // transaction/:id

  const [{ loading, error, loadingUpdate, transaction, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const transactionData = {
		plan: "",
		amount: "",
		status: "pending",
		warranty: ""
  };
  const transactionAttr = [
		{
			type: "select",
			col: 12,
			props: {
				label: "Plan",
				name: "plan",
				value: ,
				placeholder: "Select Plan",
				options: [{ 'safe': 'Safe' }, { 'secure': 'Secure' }, { 'supreme': 'Supreme' }]
				required: true,
			}
		},
		{
			type: "number",
			props: {
				label: "Amount",
				name: "amount",
				required: true,
			}
		},
		{
			type: "select",
			col: 12,
			props: {
				label: "Status",
				name: "status",
				value: 'pending',
				placeholder: "Select Status",
				options: [{ 'pending': 'Pending' }, { 'fail': 'Fail' }, { 'complete': 'Complete' }]
			}
		},
		{				required: true,
			}
		}
  ]
  const [info, setInfo] = useState(transactionData);

  useEffect(() => {
    if (transaction && transaction._id === id) {
      console.log({ transaction })
      setInfo({
				plan: transaction.plan,
				amount: transaction.amount,
				status: transaction.status,
				warranty: transaction.warranty
      });
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  const resetForm = () => { setInfo(transactionData); };
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
      title="Edit Transaction"
      data={info}
      setData={setInfo}
      inputFieldProps={transactionAttr}
      submitHandler={submitHandler}
      target="/admin/transactions"
      successMessage="Transaction Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    />
  );
}