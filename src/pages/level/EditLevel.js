import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm } from "../../components";

export default function EditLevelModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // level/:id

  const [{ loading, error, loadingUpdate, level, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const levelData = {
		level: "",
		max_age: "",
		max_mileage: ""
  };
  const levelAttr = [
		{
			type: "select",
			col: 12,
			props: {
				label: "Level",
				name: "level",
				value: ,
				placeholder: "Select Level",
				options: [{ 'safe': 'Safe' }, { 'secure': 'Secure' }, { 'supreme': 'Supreme' }]
				required: true,
			}
		},
		{
			type: "number",
			props: {
				label: "Max Age",
				name: "max_age",
				required: true,
			}
		},
		{
			type: "number",
			props: {
				label: "Max Mileage",
				name: "max_mileage",
				required: true,
			}
		}
  ]
  const [info, setInfo] = useState(levelData);

  useEffect(() => {
    if (level && level._id === id) {
      console.log({ level })
      setInfo({
				level: level.level,
				max_age: level.max_age,
				max_mileage: level.max_mileage
      });
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  const resetForm = () => { setInfo(levelData); };
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
      title="Edit Level"
      data={info}
      setData={setInfo}
      inputFieldProps={levelAttr}
      submitHandler={submitHandler}
      target="/admin/levels"
      successMessage="Level Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    />
  );
}