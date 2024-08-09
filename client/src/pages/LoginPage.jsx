import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import instance from "../api/axios"
import Swal from "sweetalert2"
import axios from "axios"
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()



    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await instance.post("/login", {
                email: email,
                password: password
            })
            localStorage.setItem("token", response.data.token);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Login successfully",
            });
            navigate("/")
        } catch (err) {
            if (err.response) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: err.response.data.message,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            }
        }
    }

    async function handleCredentialResponse({ credential }) {
        try {
            // console.log("Encoded JWT ID token: " + credential);

            const { data } = await instance({
                method: "POST",
                url: "/login/google",
                data: {
                    googleToken: credential
                }
            })
            localStorage.setItem("token", data.token);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Login successfully",
            });
            navigate("/")
        } catch (err) {
            console.log(err)
            if (err.response) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: err.response.data.message,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            }
        }
    }

    // useEffect(() => {
    //     google.accounts.id.initialize({
    //         client_id: "22551179301-gtv4f4mjq76n1fdu15lg7co1r2ta4hin.apps.googleusercontent.com",
    //         callback: handleCredentialResponse
    //     });
    //     google.accounts.id.renderButton(
    //         document.getElementById("google-login-btn"),
    //         { theme: "outline", size: "large" }  // customization attributes
    //     );
    // google.accounts.id.prompt();
    // }, [])

    return (
        <div className="row" style={{ height: "100vh" }}>
            <div className="col d-flex justify-content-center align-items-center" style={{ backgroundColor: "#0049a4" }}>
                <img src="/prili.png" alt="" width={400} />
            </div>
            <div className="col d-flex flex-column justify-content-center align-items-center"
                style={{ backgroundColor: "Gainsboro" }}>
                <form onSubmit={handleSubmit} className="w-50">
                    <div>
                        <h4 className="col d-flex flex-column justify-content-center align-items-center fs-1 fw-bolder">Rili Busana</h4>
                    </div>
                    <br />
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
                    <button type="submit" className="container fluid btn btn-primary fw-semibold">
                        Login
                    </button>
                </form>
                <br />
                <p>Don't have an account yet? <Link to="/register">Register</Link></p>
                <GoogleLogin
                    onSuccess={handleCredentialResponse}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />;
            </div>
        </div>
    )
}