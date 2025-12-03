import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET!;

// REGISTER USER
export async function registerUser(
    name: string,
    email: string,
    password: string,
    role: "CANDIDATE" | "EMPLOYER"
) {
    const hashed = await bcrypt.hash(password, 10);

    const [user] = await db
        .insert(users)
        .values({ name, email, password: hashed, role })
        .returning();

    if (!user) throw new Error("Failed to register user");

    return user;
}

// LOGIN USER
export async function loginUser(email: string, password: string) {
    const [user] = await db
        .select({
            id: users.id,
            email: users.email,
            password: users.password,
            role: users.role,
        })
        .from(users)
        .where(eq(users.email, email)); // FIXED: filter user by email

    if (!user || !user.password) return null;

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) return null;

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { token, user };
}
