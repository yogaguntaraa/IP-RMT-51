import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import instance from "../api/axios"
import swal from "sweetalert2"

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [username, setUserName] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await instance.post("/register", {
                email: email,
                password: password,
                phoneNumber: phoneNumber,
                username: username,
            })
            navigate("/login")
        } catch (err) {
            if (err.response) {
                swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: err.response.data.message,
                });
            } else {
                swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            }
        }
    }

    return (
        <div className="row" style={{ height: "100vh" }}>
            <div className="col d-flex justify-content-center align-items-center" style={{ backgroundColor: "#0049a4" }}>
                <img src="/prili.png" alt="" width={400}/>
            </div>
            <div className="col d-flex flex-column justify-content-center align-items-center"
            style={{backgroundColor: "Gainsboro"}}>
                <form onSubmit={handleSubmit} className="w-50">
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label fw-semibold">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPhoneNumber1" className="form-label fw-semibold">
                            No.Handphone
                        </label>
                        <input
                            type="phoneNumber"
                            className="form-control"
                            id="exampleInputFullName1"
                            aria-describedby="emailHelp"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputusername1" className="form-label fw-semibold">
                            Username
                        </label>
                        <input
                            type="username"
                            className="form-control"
                            id="exampleInputFullName1"
                            aria-describedby="emailHelp"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="container fluid btn btn-primary fw-semibold">
                        Register
                    </button>
                </form>
                <br />
                <p>Do you have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}