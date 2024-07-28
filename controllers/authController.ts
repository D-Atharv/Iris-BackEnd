import { Request, Response } from "express";
import prisma from "../db/prisma";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken";

export const signup = async (req: Request, resp: Response) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return resp.status(400).json({ error: "Please fill in all fields" });
        }

        if (password !== confirmPassword) {
            return resp.status(400).json({ error: "Passwords don't match" });
        }

        const user = await prisma.user.findUnique({
            where: {
                username: username
            },
        });

        if (user) {
            return resp.status(400).json({
                error: "Username already exists"
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = await prisma.user.create({
            data: {
                fullName: fullName,
                username: username,
                password: hashedPassword,
                gender: gender,
                profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
            },
        });

        if (newUser) {
            //generating the token

            generateToken(newUser.id, resp);

            resp.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });

        } else {
            resp.status(400).json({
                error: "Something went wrong"
            });
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("error in signup controller", error.message)
            resp.status(500).json({ error: "Internal Server Error" });
        };
    }
};


export const login = async (req: Request, resp: Response) => {
    try {
        const { username, password } = req.body;    
        
        const user = await prisma.user.findUnique({
            where : {
                username: username
            }
        });

        if (!user) {
            return resp.status(400).json({
                error: "invalid credentials"
            })
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if(!isPasswordCorrect) {
            return resp.status(400).json({
                error: "invalid credentials"
            })
        }

        generateToken(user.id, resp);

        resp.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("error in login controller", error.message)
            resp.status(500).json({ error: "Internal Server Error" });
        };
    }
}

export const logout = async (req: Request, resp: Response) => {
    try{
        resp.cookie("jwt","",{
            maxAge : 0,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"

        });
        resp.status(200).json({message : "Logged out successfully"});
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("error in logout controller", error.message)
            resp.status(500).json({ error: "Internal Server Error" });
        };
    }
}

export const getMe = async (req: Request, resp: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id //declared global express interface
            }
        })

        if(!user) {
            return resp.status(404).json({ 
                error: "User not found" 
            });
        }

        resp.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("error in getMe controller", error.message)
            resp.status(500).json({ error: "Internal Server Error" });
        };
    }
}





