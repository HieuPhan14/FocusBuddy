import { Link } from "react-router-dom"
import Card from "../components/Card"

const NotFoundPage = () => {

    return (
    <>
        <Card>
            <div className="flex flex-col gap-4 mx-1 p-4">
                <h1 className="text-center text-2xl font-display text-text mt-1">404 NOT FOUND</h1>
                <p className="font-display text-text text-center">
                    This page doesn't exist
                </p>

                <Link to="/" className="btn-primary text-center mx-14">
                    Back to Home
                </Link>
            </div>
        </Card>
    </>
    )
    
}

export default NotFoundPage