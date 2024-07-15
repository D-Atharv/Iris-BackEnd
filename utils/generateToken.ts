import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (userId: string, resp: Response) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
            expiresIn: "1d"
        });

        resp.cookie("jwt", token, {
            maxAge: 24 * 60 * 60 * 1000, // milliseconds = 1d
            httpOnly: true, // prevents XSS cross site scripting
            sameSite: "strict", //prevetns CSRF attack cross-site request forging
            secure: process.env.NODE_ENV === "production" // https only in production environment 
        });

        return token;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

export default generateToken;