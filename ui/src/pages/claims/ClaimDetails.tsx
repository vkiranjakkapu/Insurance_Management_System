import { useParams } from "react-router-dom";

export default function ClaimDetails() {
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <p>Claim Details of {id}</p>
        </>
    );
}
