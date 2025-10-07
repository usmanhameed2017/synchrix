import { useCallback } from 'react';
import * as Yup from "yup";
import { useChat } from '../../context/chat';
import { useUser } from '../../context/user';
import ModalBS from '../Modal';
import FormikForm from '../FormikForm';
import Input from '../InputFields';
import Button from '../Button';
import api from '../../service/axios';

function AddNewMembersToGroup({ showModal, setShowModal }) 
{
    // Global states
    const { selectedGroup, setSelectedGroup } = useChat();
    const { users } = useUser();

    // Initial values
    const initialValues = {
        _id: selectedGroup?._id || "",
        members: []
    };

    // Validation schema
    const validationSchema = Yup.object({
        members:Yup.array()
        .min(1, "Please select at least one member")
    });

    // Add new members to group
    const addNewMembers = useCallback(async (payload) => {
        if(!payload?._id) return;
        try 
        {
            const response = await api.patch({ url:`/group/addNewMembers/${payload._id}`, payload });
            setSelectedGroup(response.data);
            setShowModal(false);
        } 
        catch(error) 
        {
            console.log(error.message);
        }
    },[]); 

    return (
        <>
            {/* Modal For Adding New Members */}
            <ModalBS showModal={showModal} setShowModal={setShowModal} modalTitle="Add New Members">
                <FormikForm initialValues={initialValues} validationSchema={validationSchema} handlerFunction={addNewMembers} className={`/`}>
                    {/* Members */}
                    <div className="form-group">
                        <label htmlFor="members" className='d-flex mb-1'>Select Members</label>
                        <Input type="select" name="members" placeholder="Select Members" multiple>
                            {users.map(user => {
                                const isMember = selectedGroup?.members?.some(memberId => memberId === user?._id);
                                if(!isMember) return <option value={user?._id} key={user?._id}> { user.name } </option>                                    
                            })}
                        </Input>
                    </div>
                    <hr />

                    {/* Buttons */}
                    <div className='d-flex mt-3 gap-2'>
                        <Button type="submit"> Save Changes </Button>
                        <Button type="button" onClick={ () => setShowModal(false) }> Cancel </Button>
                    </div>
                </FormikForm>
            </ModalBS>        
        </>
    );
}

export default AddNewMembersToGroup;