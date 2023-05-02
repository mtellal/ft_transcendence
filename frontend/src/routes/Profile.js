import React, { useState } from "react";
import imgProfile from '../images/user.png'
// import s from '../styles/Profile.css'
import '../styles/Profile.css'



// function ProfileInfos(props)
// {
    
//     function updateProfile()
//     {
//         console.log("ProfileInfos: profile updated");
//     }

//     return (
//         <div className="form--container">
//             <InfoInput 
//                 id={Math.floor(Math.random() * 1000000)}
//                 label="Username"

//             />
//             <InfoInput 
//                 id={Math.floor(Math.random() * 1000000)}
//                 label="Password"

//             />  
//             <InfoInput 
//                 id={Math.floor(Math.random() * 1000000)}
//                 label="Phone number"

//             />
//             <button onClick={updateProfile} className="profile-infos-button" >Update</button>         
//         </div>
//     )
// }

/*
    - update user infos with fetch a PATCH/POST method (or any other update html method)
    - handle pp edit, save it in session/local storage and push in database ? or fetch, update database and fetch it again ? 
*/

// function ProfilePicture()
// {
//     const [img, setImg] = React.useState(imgProfile);

//     function editProfilePicture(e)
//     {
//         setImg(URL.createObjectURL(e.target.files[0]));
//     }

//     function disconnect()
//     {
//         console.log("ProfilePicture: disconnection")
//     }

    // return (
    //     <div className="profile-picture-container">
    //         <img className="profile-picture" src={img} />
    //         <form >
    //             <label 
    //                 htmlFor="edit" 
    //                 className="profil-picture-label"
    //             >
    //                 Edit
    //             </label>
    //             <input
    //                 id="edit"
    //                 type="file"
    //                 placeholder="edit"
    //                 className="profile-picture-input"
    //                 onChange={editProfilePicture}
    //             />
    //         </form>
    //         <button 
    //             className="profile-picture-button" 
    //             onClick={disconnect}
    //         >
    //             Disconnect
    //         </button>
    //     </div>
    // )
// }

// export default function Profile(props)
// {
//     return (
//         <div className="profile">
//             <ProfileInfos />
//             <ProfilePicture />              
//         </div>
//     );
// }





// Username
// Password
// Phone number

class ValidatorServices {

	static min(value, min){
		if (value.length < min && value !== "")
			return `Veuillez taper au moins ${min} lettre(s)`;
	}

	static max(value, max) {
		if (value.length > max)
		return `Veullez taper au plus ${max} lettre(s)`;
	}
}

function FieldError({ msg }) {
	return (
		<span className="container">{msg}</span>
	);
}

const VALIDATORS = {
	username: (value) => {
		return ValidatorServices.min(value, 3) || ValidatorServices.max(value, 20);
	},
	password: (value) => {
		return ValidatorServices.min(value, 3)
	},
	phoneNumber: (value) => {
		return ValidatorServices.min(value, 3)
	}
}

function InfoInput( {id, label, nameForm, formErrors, setFormErrors} )
{
    // const [value, setValue] = React.useState("");
    const [formValues, setFormValues] = useState({username: "", password: "", phoneNumber: ""});
	// const [formErrors, setFormErrors] = useState({username: "", password: "", phoneNumber: ""});

    function validate(fieldName, fieldValue) {
        setFormErrors({...formErrors, [fieldName]: VALIDATORS[fieldName](fieldValue)});
    }

    function updateFormValues(e) {
        // console.log(e.target.name, e.target.value);
        setFormValues({...formValues, [e.target.name]: e.target.value});
        validate(e.target.name, e.target.value);
    }

    // console.log(formValues);
    // console.log(nameForm);

    return (
        <div className="input--container">
            <label className="input--label" >{label}</label>
            <input
                id={id}
                className="input"
                type="text"
                name={nameForm}
                placeholder={label}
                // value={name}
                // onChange={(e) => setValue(e.target.value)}
                onChange={updateFormValues}
            />
			<FieldError msg={formErrors[nameForm]} />
        </div>
    )
}

export default function Profile(props)
{

	const [formErrors, setFormErrors] = useState({username: "", password: "", phoneNumber: ""});
    const [img, setImg] = React.useState(imgProfile);

	function hasError() {
		return Object.values(formErrors).some((error) => (error !== undefined && error !== ""));
	}

    function updateProfile()
    {
        console.log("ProfileInfos: profile updated");
    }


    function editProfilePicture(e)
    {
        setImg(URL.createObjectURL(e.target.files[0]));
    }

    function disconnect()
    {
        console.log("ProfilePicture: disconnection")
    }

    const profileInfos = (
        <div className="form--container">
            <InfoInput 
                id={Math.floor(Math.random() * 1000000)}
                label="Username"
                nameForm="username"
                formErrors={formErrors}
                setFormErrors={setFormErrors}
            />
            <InfoInput 
                id={Math.floor(Math.random() * 1000000)}
                label="Password"
                nameForm="password"
                formErrors={formErrors}
                setFormErrors={setFormErrors}
            />  
            <InfoInput 
                id={Math.floor(Math.random() * 1000000)}
                label="Phone number"
                nameForm="phoneNumber"
                formErrors={formErrors}
                setFormErrors={setFormErrors}
            />
            <button disabled={hasError()} onClick={updateProfile} className="profile-infos-button" >Update</button>         
        </div>
    );

    const ProfilePicture = (
        <div className="profile-picture-container">
            <img className="profile-picture" src={img} alt="imgProfile"/>
            <form >
                <label htmlFor="edit" className="profil-picture-label">Edit</label>
                <input
                    id="edit"
                    type="file"
                    placeholder="edit"
                    className="profile-picture-input"
                    onChange={editProfilePicture}
                />
            </form>
            <button className="profile-picture-button" onClick={disconnect} >
                Disconnect
            </button>
        </div>
    );

    return (
        <div className="profile">
            {profileInfos}
            {ProfilePicture}
        </div>
    );
}