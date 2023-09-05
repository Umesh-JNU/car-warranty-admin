import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm, TextInput } from "../../components";
import { uploadImage } from "../../utils/uploadImage";
import { Col, ProgressBar, Row } from "react-bootstrap";
import { toast } from "react-toastify";

export default function EditUserModel(props) {
	const { state } = useContext(Store);
	const { token } = state;
	const { id } = useParams();  // user/:id

	const [{ loading, error, loadingUpdate, user, success }, dispatch] = useReducer(reducer, {
		loading: true,
		loadingUpdate: false,
		error: "",
	});

	const userData = {
		email: "",
		image_url: "",
		firstname: "",
		lastname: "",
		mobile_no: "",
		role: "user",
		addr: "",
	};
	const userAttr = [
		{
			type: "text",
			props: {
				label: "Firstname",
				name: "firstname",
			}
		},
		{
			type: "text",
			props: {
				label: "Lastname",
				name: "lastname",
			}
		},
		{
			type: "text",
			props: {
				label: "Email",
				name: "email",
				required: true,
			}
		},
		{
			type: "text",
			props: {
				label: "Mobile No.",
				name: "mobile_no",
			}
		},
		{
			type: "select",
			col: 12,
			props: {
				label: "Role",
				name: "role",
				value: 'user',
				placeholder: "Select Role",
				options: [{ 'user': 'User' }, { 'admin': 'Admin' }]
			}
		}
	]
	const [info, setInfo] = useState(userData);
	const handleInput = (e) => {
    setInfo({ ...info, addr: { ...info.addr, [e.target.name]: e.target.value } });
  }

	const [uploadPercentage, setUploadPercentage] = useState(0);
	const [isUploaded, setIsUploaded] = useState(false);
	const uploadPercentageHandler = (per) => { setUploadPercentage(per); };

	const uploadFileHandler = async (e, type) => {
		if (!e.target.files[0]) {
			// if (!file) {
			setInfo({ ...info, image_url: null });
			return;
		}
		if (e.target.files[0].size > 5000000) {
			toast.warning("Image size is too large. (max size 5MB)", {
				position: toast.POSITION.BOTTOM_CENTER,
			});
			setInfo({ ...info, image_url: null });
			return;
		}
		try {
			// if (e.target.files[0]) {
			const location = await uploadImage(
				e.target.files[0],
				// file,
				token,
				uploadPercentageHandler
			);
			if (location.error) {
				throw location.error;
			}

			setInfo({ ...info, image_url: location });
			setTimeout(() => {
				setUploadPercentage(0);
				setIsUploaded(true);
			}, 1000);
		} catch (error) {
			toast.error(error, {
				position: toast.POSITION.BOTTOM_CENTER,
			});
		}
	};

	useEffect(() => {
		if (user && user._id === id) {
			console.log({ user })
			setInfo({
				email: user.email,
				password: user.password,
				firstname: user.firstname,
				lastname: user.lastname,
				mobile_no: user.mobile_no,
				role: user.role,
				addr: user.addr
			});
		}

		(async () => {
			await getDetails(dispatch, token, id);
		})();
	}, [id, props.show]);

	const resetForm = () => { setInfo(userData); };
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
			title="Edit User"
			data={info}
			setData={setInfo}
			inputFieldProps={userAttr}
			submitHandler={submitHandler}
			target="/admin/users"
			successMessage="User Updated Successfully! Redirecting..."
			reducerProps={{ loadingUpdate, error, success, dispatch }}
		>
			<Row>
				<Col md={12}>
					<TextInput
						value={info?.addr?.address}
						required="true"
						label="Address"
						name="address"
						onChange={handleInput}
					/>
				</Col>
				<Col md={6}>
					<TextInput
						value={info?.addr?.city}
						required="true"
						label="City"
						name="city"
						onChange={handleInput}
					/>
				</Col>
				<Col md={6}>
					<TextInput
						value={info?.addr?.postcode}
						required="true"
						label="Postcode"
						name="postcode"
						onChange={handleInput}
					/>
				</Col>
			</Row>
			<>
				<TextInput label="Upload Image" type="file" accept="image/*" onChange={(e) => uploadFileHandler(e)} />
				{uploadPercentage > 0 && (
					<ProgressBar
						now={uploadPercentage}
						active
						label={`${uploadPercentage}%`}
					/>
				)}
			</>
		</EditForm>
	);
}