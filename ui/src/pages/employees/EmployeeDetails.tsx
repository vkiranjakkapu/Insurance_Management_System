import { useParams } from "react-router-dom";

export default function EmployeeDetails() {
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <p>Employee Details for {id}</p>
        </>
    );
}
