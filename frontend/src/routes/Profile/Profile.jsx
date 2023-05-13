import { useDispatch, useSelector } from "react-redux";
import { BackApi } from "../../api/back";
import logo_user from "../../assets/logo_identifiant.png"
import logo_password from "../../assets/logo_mdp.png"
import s from './style.module.css'
import { store } from "../../store";
import { useState } from "react";

export function Profile() {

    // const dispatch = useDispatch();
    // const selector = useSelector(store => store.USER.user);

    // async function updateProfile(e) {
    //     e.preventDefault();
    //     const user = e.target.username.value;
    //     const passwd = e.target.password.value;

    //     let updateinfos = {userStatus: "ONLINE"};
    //     if (user) {
    //         updateinfos.username = user;
    //     } if (passwd) {
    //         updateinfos.password = passwd;
    //     }

    //     console.log(updateinfos);

    //     const response = await BackApi.updateInfoProfile(2, updateinfos)
    //     if (response.status === 200) {
    //         console.log('profile updated');
    //     } else {
    //         console.log('profile NOT updated');
    //         console.log(response.data.message);
    //     }
    // }

    // function handleChange(e) {
    //     // setState
    //     console.log('ok');
    // }

    // return (
    //     <div className={s.profile}>
    //         <div className={s.title}>Update profile</div>
    //         <form onSubmit={updateProfile} className={s.form}>
    //             <img className={s.logoUser} src={logo_user} alt="logo user"></img>
    //             <input type="text" className={s.element} placeholder='Username' name="username" ></input>
    //             <img className={s.logoPasswd} src={logo_password} alt="logo password"></img>
    //             <input type="password" className={s.element} placeholder='Password' name="password" id="input"></input>

    //             {/* <input type="file" onChange={handleChange} name="avatar" accept="image/jpeg image/png image/jpg" ></input> */}
    //             {/* <img src={state.file} /> */}
    //             {/* <output id="output"></output> */}
    //             {/* <input className={s.element} placeholder='Password' name="password" ></input> */}
    //             <button type='submit' className={s.element}>Update</button>
    //         </form>
    //     </div>
    // );

    const selector = useSelector(store => store.USER.user);
    const [img, setImg] = useState(null);

    async function setProfilePicture(e) {
        const file = e.target.files[0];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            setImg(reader.result);
          };
      
          const response = await BackApi.updateProfilePicture(file, selector.token);
          if (response.status !== 201) {
            console.log("Error uploading file");
          }
      
          console.log("File uploaded successfully!");
      }
      
    
    console.log('TOKEN ', selector.token);

    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="file" accept="image/*" name="image" onChange={setProfilePicture} />
        {/* <button type="submit">Upload</button> */}
      </form>
    );
}