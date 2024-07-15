import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../db/prisma";

import { Request, Response, NextFunction } from "express";

interface DecodedToken extends JwtPayload {
    userId: string;
}

//doing this to use req.user
declare global{
    namespace Express {
        export interface Request {
            user: {
                id: string;
            }
        }
    }
}

export const protectRoute = async (req: Request, resp: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return resp.status(401).json({ 
                error: "Unauthorized - No token provided" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

        if (!decoded) {
            return resp.status(401).json({ 
                error: "Unauthorized - Invalid token" 
            });
        };

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                id: true,
                fullName: true,
                username: true,
                profilePic: true
            }
        });

        if (!user) {
            return resp.status(404).json({ 
                error: "Unauthorized. User Not Found " 
            });
        }
        
        req.user = user;

        next();
    
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("error in protectRoute middleware", error.message)
            resp.status(500).json({ error: "Internal Server Error" });
        };
    }
}