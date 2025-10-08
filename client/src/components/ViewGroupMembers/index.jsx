import ModalBS from '../Modal';
import styles from "./style.module.css";
import { FaCrown, FaUser, FaUsers } from 'react-icons/fa';
import MenuPopup from '../MenuPopup';
import { useChat } from '../../context/chat';
import { useUser } from '../../context/user';
import { userData } from '../../utils/getUser';
import sweetAlert from '../../utils/sweetAlert2';
import { useCallback } from 'react';
import api from '../../service/axios';

function ViewGroupMembers({ showModal, setShowModal }) 
{
    // Global states
    const { selectedGroup, selectedGroupRef } = useChat();
    const { users } = useUser();

    // Make group admin
    const makeGroupAdmin = useCallback(async (payload) => {
        if(!payload?._id) return;
        if(!selectedGroupRef.current) return;

        try 
        {
            await api.patch({ url:`/group/${selectedGroupRef.current}/make-group-admin/${payload._id}`, enableSuccessMessage:false });
        } 
        catch(error) 
        {
            console.log(error.message);
        }        
    },[]);

    // Remove as admin
    const removeFromAdmin = useCallback(async (payload) => {
        if(!payload?._id) return;
        if(!selectedGroupRef.current) return;

        try 
        {
            await api.patch({ url:`/group/${selectedGroupRef.current}/remove-from-admin/${payload._id}`, enableSuccessMessage:false });
        } 
        catch(error) 
        {
            console.log(error.message);
        }        
    },[]);    

    // Remove member by admin
    const removeMember = useCallback((payload) => {
        if(!payload?._id) return;
        if(!selectedGroupRef.current) return;

        sweetAlert.confirm({ title:"Confirm?", text:"Are you sure to remove this member from the group?", fn:async () => {
            try 
            {
                await api.patch({ url:`/group/${selectedGroupRef.current}/member/${payload._id}`, enableSuccessMessage:false });
            } 
            catch(error) 
            {
                console.log(error.message);
            }
        }});
    },[]);
  
    return (
        <>
            <ModalBS showModal={showModal} setShowModal={setShowModal} modalTitle="Group Members">
                {/* ======================================== ADMIN SECTION ======================================== */}
                <h5 className={styles.heading}> <FaCrown size={25} /> Admins </h5>

                {/* Group admin list */}
                <div className={`${styles.groupMembersList} mb-4`}>
                {users && Array.isArray(users) && users.length > 0 ? (
                    users.map(user => {
                        const isAdmin = selectedGroup?.admins.some(adminId => adminId === user?._id);
                        if(isAdmin) return (
                            <div key={user?._id} className="d-flex align-items-center justify-content-between mb-2">
                                {/* Left side: user name */}
                                {user?._id === userData?._id ? (
                                    <>
                                        <label className="mb-0">
                                            <FaCrown className="me-2" /> You
                                        </label>                                 
                                    </>
                                )
                                :
                                (
                                    <>
                                        <label className="mb-0">
                                            <FaCrown className="me-2" /> { user?.name }
                                        </label>

                                        {/* Menu option based on roles */}
                                        {selectedGroup?.admins.includes(userData?._id) ? (
                                            <>
                                                {/* Right side: menu for admin */}
                                                <MenuPopup item={user} options={ [{ name:"Remove admin", handler:removeFromAdmin } ]} /> 
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                {/* Right side: menu for user */}
                                                <MenuPopup item={user} options={ [{ name:"Private message", handler:removeMember }] } /> 
                                            </>
                                        )}
                                     
                                    </>
                                )}
                            </div>
                        );
                    })
                )
                :
                (
                    <>
                        <label className='text-center'> No Admins Found </label>
                    </>
                )}
                </div> 

                {/* ======================================== MEMBERS SECTION ======================================== */}
                <h5 className={styles.heading}> <FaUsers size={25} /> Members </h5>

                {/* Group members list */}
                <div className={styles.groupMembersList}>
                {users && Array.isArray(users) && users.length > 0 ? (
                    users.map(user => {
                        const isMember = selectedGroup?.members.some(memberId => memberId === user?._id);
                        const isAdmin = selectedGroup?.admins.some(adminId => adminId === user?._id);
                        if(isMember && !isAdmin) return (
                            <div key={user?._id} className="d-flex align-items-center justify-content-between mb-2">
                                {/* Left side: user name */}
                                {user?._id === userData?._id ? (
                                    <>
                                        <label className="mb-0">
                                            <FaUser className="me-2" /> You
                                        </label>                                 
                                    </>
                                )
                                :
                                (
                                    <>
                                        <label className="mb-0">
                                            <FaUser className="me-2" /> { user?.name }
                                        </label>

                                        {/* Menu option based on roles */}
                                        {selectedGroup?.admins.includes(userData?._id) ? (
                                            <>
                                                {/* Right side: menu for admin */}
                                                <MenuPopup item={user} options={[
                                                    { name:"Make admin", handler:makeGroupAdmin }, 
                                                    { name:"Remove", handler:removeMember }
                                                ]} /> 
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                {/* Right side: menu for user */}
                                                <MenuPopup item={user} options={[
                                                    { name:"Private message", handler:removeMember }
                                                ]} /> 
                                            </>
                                        )}                                       
                                    </>
                                )}
                            </div>
                        );
                    })
                )
                :
                (
                    <>
                        <label className='text-center'> No Members Found </label>
                    </>
                )}
                </div>               
            </ModalBS>         
        </>
    );
}

export default ViewGroupMembers;