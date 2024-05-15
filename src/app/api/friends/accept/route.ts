import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id: idToAdd } = z.object({ id: z.string() }).parse(body);
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }
        const isAlreadyFriends = await fetchRedis(
            "sismember",
            `user:${session.user.id}:friends`,
            idToAdd
        );

        if (isAlreadyFriends) {
            return new Response("Already Frienmds", { status: 401 });
        }
        const hasFriendRequest = await fetchRedis(
            "sismember",
            `user:${session.user.id}:incomming_friend_requests`,
            idToAdd
        );

        console.log("req 2");
        console.log("hasFriendRequest", hasFriendRequest);

        if (!hasFriendRequest) {
            return new Response("No friend request", { status: 400 });
        }

        await db.sadd(`user:${session.user.id}:friends`, idToAdd);
        await db.sadd(`user:${idToAdd}:friends`, session.user.id);
        //! outbound_friend_requests -> incomming_friend_requests
        await db.srem(`user:${session.user.id}:incomming_friend_requests`, idToAdd);
        
        return new Response("OK");
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return new Response("Invalid Request Payload", { status: 400 });
        }
    }
}
