import { useParams } from "react-router-dom";

export default function PolicyDetails() {
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <p>Policy Details of {id}</p>
        </>
    );
}
