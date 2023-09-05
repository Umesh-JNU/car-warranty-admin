import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { AutocompleteSearch, SubmitButton } from '../../components';
import { toast } from 'react-toastify';
import { toastOptions } from '../../utils/error';
import { clearSuccess } from '../../states/actions';
import { updateSalePerson } from './state/action';

function SalePersonModal(props) {
  const { show, handleClose, warrantyID, token, success, loading, dispatch } = props;
  const [salePerson, setSalePerson] = useState(null);

  const handleSaleSelect = async (salePerson) => {
    console.log({ salePerson });
    setSalePerson(salePerson);
  };

  const handleTask = async () => {
    if (!salePerson && show) {
      toast.error("Please select a sale person", toastOptions);
      return;
    }
    await updateSalePerson(dispatch, token, warrantyID, salePerson);
  };

  useEffect(() => {
    setSalePerson(null);
  }, [show]);

  if (success) {
    toast.success("Success", toastOptions);
    clearSuccess(dispatch);
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select Sale Person</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Search sale person and assign this task.</h6>
          <AutocompleteSearch searchType="user" onSelect={handleSaleSelect} />

          {salePerson &&
            <div className='d-flex mt-3'>
              <div className='me-3'>
                <img src={salePerson.profile_img} alt="img" width={50} height={50} />
              </div>
              <div className='w-100'>
                <p className="mb-1">{salePerson.firstname} {salePerson.lastname}</p>
                <p className="mb-1"><b>Email: </b>{salePerson.email}</p>
                <p className="mb-1"><b>Mobile: </b>{salePerson.mobile_no}</p>
              </div>
            </div>
          }

        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose} disabled={loading}>
            Close
          </Button>
          <SubmitButton variant="success" onClick={handleTask} loading={loading} disabled={loading}>
            Save Changes
          </SubmitButton>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SalePersonModal