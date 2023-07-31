import React, {useState} from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import "./css/styles.css";
import {Link} from 'react-router-dom'

const SubmitForm = ({isNewUser=true}) =>{

    const intialFormData = {
        email: "",
        dob: null,
        password: "",
        age: "",
        oldEmail:'',
        oldPassword:'',
    }

    const [formData ,setFormData] = useState(intialFormData)

    const [error, setError] = useState({success: false, msg : ""});
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const {name, value}    = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleDateChange = (date) => {
        if(date){
            const today = new Date();
            const birthDate = new Date(date);
            let age = today.getFullYear() - birthDate.getFullYear();

            const birthMonth = birthDate.getMonth();
            const currentMonth = today.getMonth();
            if (birthMonth > currentMonth) {
            age--;
            } else if (birthMonth === currentMonth) {
            // If the birth month is the same as the current month, check the day
            const birthDay = birthDate.getDate();
            const currentDay = today.getDate();
            if (birthDay > currentDay) {
                age--;
            }

            }
            setFormData({...formData, dob: date, age: age});
        }
        else{
            setFormData({...formData, dob: null, age: ''});
        }
        
    }

    const clearData = () => {
        setFormData(intialFormData)
        setError({success: false, msg : ""})
        setSuccess(false)
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        const formDataToSubmit = {
            email: formData.email,
            dob: formData.dob,
            age: formData.age,
            password: formData.password,
            oldEmail: formData.oldEmail,
            oldPassword: formData.oldPassword,
        }

        let path = isNewUser === true ? "submitForm" : "updateForm"

        fetch(`http://localhost:5000/${path}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataToSubmit)
        }).then( (res) => res.json())
        .then((data) => {
            if(!data.success){
                setError({success: true, msg : data.message})
                setSuccess(false)
            }
            else{
                setError({success: false, msg : ""})
                setSuccess(true)
            }
            console.log('Responce Data ', data)
        })
        .catch((error) => {
            console.log('Error', error)
        })
    }

    // 
    const newUser = (
        <div className="parent-container">
            <h2> New User </h2><br></br>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input 
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onError={() => alert("User Already Exist !")}
                />
                <br/>
                {error.success && <p style={{ color: 'red', width: "300px" }}>{error.msg}</p>}
                <br/>

                <label htmlFor="dob">Date Of Birth:</label>
                <ReactDatePicker 
                    id="dob"
                    name="dob"
                    selected={formData.dob}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                    required
                />
                
                <br/><br/>

                <label htmlFor="age">Age:</label>
                <select id="age" name="age"  onChange={handleInputChange}  required>
                    <option value={formData.age}>{formData.age}</option>
                </select>
                <br/><br/>

                <label htmlFor="password">Password:</label>
                <input 
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                <br/><br/>
                <div className="button-container">
                <input type="submit" value="Submit"/>
                <Link to="/verify">
                    <button className="button-spacing" onClick={clearData}>Update User</button>
                </Link>
                

                {success && <p style={{ color: 'lightgreen', width: "300px" }}>User Created </p>}
                
                </div>
            </form>
        </div>
    )

    const updateUser = (
        <div className="parent-container" >
            <h2> Update User </h2>
            <br/>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email"> Old Email:</label>
                <input 
                    type="email"
                    id="oldEmail"
                    name="oldEmail"
                    value={formData.oldEmail}
                    onChange={handleInputChange}
                />
                <br/>
                <br/>

                <label htmlFor="email"> New Email:</label>
                <input 
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <br/><br/>

                <label htmlFor="dob">Date Of Birth:</label>
                <ReactDatePicker 
                    id="dob"
                    name="dob"
                    selected={formData.dob}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                    required
                />
                
                <br/><br/>

                <label htmlFor="age">Age:</label>
                <select id="age" name="age"  onChange={handleInputChange}  required>
                    <option value={formData.age}>{formData.age}</option>
                </select>
                <br/><br/>

                <label htmlFor="password">Old Password:</label>
                <input 
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                    required
                />
                <br/><br/>

                <label htmlFor="password">Password:</label>
                <input 
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                <br/><br/>

                <input type="submit" value="Submit"/>
                <Link to="/">
                    <button className="button-spacing" onClick={clearData}>Cancel</button>
                </Link>
                
                {error.success && <p style={{ color: 'red', width: "300px" }}>{error.msg}</p>}
                {success && <p style={{ color: 'lightgreen', width: "300px" }}>User Updated </p>}
            </form>
        </div>
    )
    return isNewUser === true ? newUser : updateUser
}

export default SubmitForm;