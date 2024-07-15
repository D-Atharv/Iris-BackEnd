import { Request, Response } from "express";
import prisma from "../db/prisma";
export const sendMessage = async (req: Request, resp: Response) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        let conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, receiverId]
                }
            }
        })

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, receiverId]
                    }
                }
            })
        }

        const newMessage = await prisma.message.create({
            data: {
                senderId: senderId,
                body: message,
                conversationId: conversation.id
            }
        });

        if (newMessage) {
            conversation = await prisma.conversation.update({
                where: {
                    id: conversation.id
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id
                        }
                    }
                }
            })
        }

        resp.status(200).json(newMessage);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("error in sendMessage controller", error.message)
            resp.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export const getMessage = async (req: Request, resp: Response) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;

        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, userToChatId]
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc"
                    },
                }
            }
        })

        if (!conversation) {
            return resp.status(200).json([]);
        }
        resp.status(200).json(conversation.messages);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("error in getMessage controller", error.message)
            resp.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export const getUsersForSidebar = async (req: Request, resp: Response) => {
    try{
        const authUserId = req.user.id;
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: authUserId
                }
            },
            select: {
               id:true,
               fullName:true,
               profilePic:true 
            }
        })

        resp.status(200).json(users);

    } catch(error: unknown){
        if(error instanceof Error){
            console.log("error in getUsersForSidebar controller", error.message)
            resp.status(500).json({ error: "Internal Server Error" });
        }
    }
}