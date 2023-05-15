import { useDispatch, useSelector } from "react-redux";
import { BackApi } from "../../api/back";
import logo_user from "../../assets/logo_identifiant.png"
import logo_password from "../../assets/logo_mdp.png"
import s from './style.module.css'
// import { store } from "../../store";
// import { useState } from "react";
import { setAvatar } from "../../store/user/user-slice";

export function Profile() {

    const selector = useSelector(store => store.USER.user);
    const dispatch = useDispatch();

    async function updateProfile(e) {
        e.preventDefault();
        const user = e.target.username.value;
        const passwd = e.target.password.value;

        let updateinfos = {userStatus: "ONLINE"};
        if (user) {
            updateinfos.username = user;
        } if (passwd) {
            updateinfos.password = passwd;
        }

        console.log(updateinfos);

        const response = await BackApi.updateInfoProfile(selector.id, updateinfos)
        if (response.status === 200) {
            console.log('profile updated');
        } else {
            console.log('profile NOT updated');
            console.log(response.data.message);
        }
    }

    async function setProfilePicture(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log('A SAVE ', reader.result);
        dispatch(setAvatar(reader.result));
      };

      const response = await BackApi.updateProfilePicture(file, selector.token);
      if (response.status !== 201) {
        console.log("PROFILE Error uploading file");
      } else {
        console.log("PROFILE File uploaded successfully!");
      }
  }

    // function handleChange(e) {
    //     // setState
    //     console.log('ok');
    // }

    return (
        <div className={s.profile}>
            <div className={s.title}>Update profile</div>
            {/* <form onSubmit={(e) => e.preventDefault()}> */}
              {/* <input className={s.input_img} type="file" accept="image/*" name="image" onChange={setProfilePicture} /> */}
              {/* {selector.avatar && <img className={s.img} src={selector.avatar} />} */}
              <label htmlFor="file" className={s.label_file}>Choisir une image</label>
              <input id="file" className={s.input_file} type="file" accept="image/*" name="image" onChange={setProfilePicture} />
              {/* <input className={s.input_img} type="file" accept="image/*" name="image" onChange={setProfilePicture} /> */}
              {selector.avatar && <img className={s.img} src={selector.avatar} alt="profile_picture"/>}
            {/* </form> */}
            <form onSubmit={updateProfile} className={s.form}>
                <img className={s.logoUser} src={logo_user} alt="logo user"></img>
                <input type="text" className={s.element} placeholder='Username' name="username" ></input>
                <img className={s.logoPasswd} src={logo_password} alt="logo password"></img>
                <input type="password" className={s.element} placeholder='Password' name="password" id="input"></input>
                <button type='submit' className={s.element}>Update</button>
            </form>
        </div>
    );
}
