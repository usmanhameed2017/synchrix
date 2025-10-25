import { useCallback } from 'react'
import ModalBS from '../Modal';
import FormikForm from '../FormikForm';
import Input from '../InputFields';
import Button from '../Button';
import { useUser } from '../../context/user';
import { userData } from '../../utils/getUser';
import api from '../../service/axios';

function CreateGroup({ showModal, handleCloseModal }) 
{
    // Global state
    const { users } = useUser();

    // Initial values
    const initialValues = {
        name:"",
        members:[]
    };

    // Create group handler
    const createGroup = useCallback(async (payload, action) => {
        try
        {
            await api.post({ url:"/group/create", payload });
            action.resetForm();
            handleCloseModal();
        } 
        catch(error) 
        {
            console.log(error.message);
        }
    },[]);

    return (
        <>
            {/* Modal */}
            <ModalBS showModal={showModal} handleCloseModal={handleCloseModal} modalTitle="Create a Group">
                {/* Form */}
                <FormikForm initialValues={initialValues} handlerFunction={createGroup}  className="/">
                    {/* Group Name */}
                    <div className="form-group mb-3">
                        <label htmlFor="name" className="d-flex">Group Name</label>
                        <Input type="text" name="name" placeholder="Enter Group Name" required />
                    </div>

                    {/* Member */}
                    <div className="form-group">
                        <label htmlFor="members" className="d-flex">Select Members</label>
                        <Input type="select" name="members" placeholder="Select Members" multiple required>
                            <option value="">Select Members</option>
                            {users?.map(user => 
                                user?._id !== userData?._id && <option value={user?._id} key={user?._id}> { user?.name } </option>
                            )}
                        </Input>
                    </div> 
                    <hr />

                    {/* Buttons */}
                    <div className="mt-3">
                        <div className="d-flex">
                            <div className="me-1"> 
                                <Button type="submit"> Create </Button>  
                            </div>
                            <div>
                                <Button type="button" onClick={handleCloseModal}> Cancel </Button>
                            </div>
                        </div>
                    </div>
                </FormikForm>
            </ModalBS>        
        </>
    );
}

export default CreateGroup;