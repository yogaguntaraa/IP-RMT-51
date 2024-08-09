import { Link } from "react-router-dom";
// #0049a4

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg"
            style={{ backgroundColor: "#0049a4" }}>
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src="/prili.png" alt="" style={{ width: "4vw" }} />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <Link className="d-flex btn btn-outline-danger" 
                    onClick={() => {
                        localStorage.removeItem("token");
                    }}  to= "/login">
                    Logout
                </Link>
            </div>
        </nav>
    )
}