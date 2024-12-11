import { auth } from "@/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, res){
    const session = await auth();
    if(!session) return res.status(401).send({message: "Unauthorized"});
    const user = session.user;

}