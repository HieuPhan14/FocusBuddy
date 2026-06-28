import { Link } from "react-router-dom";

const LoginPage = () => {

    
    return (
    <>
        <Link to="/signup">Don't have an account? Sign up</Link>
        <Link to="/">Focus without log in</Link>
    </>
    )
}

export default LoginPage;