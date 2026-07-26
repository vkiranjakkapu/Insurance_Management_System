import { useParams } from "react-router-dom";

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();

  return <div>Customer ID: {id}</div>;
}