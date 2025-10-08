import swal from "sweetalert2";
import "./style.css";

// Sweet Alert Blueprint
class SweetAlert
{
    // Success
    success = ({ title = "Success", text, confirmButtonText = "OK", cancelButtonText = "Cancel", timer = 2000 }) => {
        return (
            swal.fire({
                title:title,
                text:text,
                icon:"success",
                showCloseButton:true,
                showCancelButton:true,
                confirmButtonText:confirmButtonText,
                cancelButtonText:cancelButtonText,
                allowOutsideClick:false,
                timer:timer
            })     
        );
    };

    // Confirm
    confirm = ({ title = "Are you sure?", text = "This action will permanently delete the record.", confirmButtonText = "Yes!", cancelButtonText = "No", timer = 10000, fn }) => {
        return(
            swal.fire({
                title:title,
                text:text,
                icon:"question",
                showCloseButton:true,
                showCancelButton:true,
                confirmButtonText:confirmButtonText,
                cancelButtonText:cancelButtonText,
                allowOutsideClick:false,
                timer:timer
            })
            .then(async (result) => {
                if(result.isConfirmed) await fn();
            })
        );
    };
}

// Instance
const sweetAlert = new SweetAlert();

export default sweetAlert;