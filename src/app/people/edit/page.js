import connectDB from "@/lib/mongodb";
import EditForm from "./editForm";
import { ObjectId } from "mongodb";

export default async function Page() {

  const db = (await connectDB).db("weirdlab_people");
  const data = await db.collection("people").findOne({});

  return <EditForm initialData={JSON.parse(JSON.stringify(data))} />;
}
