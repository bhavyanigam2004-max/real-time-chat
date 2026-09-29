import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId,io } from "../socket/socket.js";


export const sendMessage=async (req,res)=>{
    try {
        let sender=req.userId
        let {receiver}=req.params
        let {message}=req.body

        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.buffer)
        }

        let conversation=await Conversation.findOne({
            participants:{$all:[sender,receiver]}
        })

        let newMessage=await Message.create({
            sender,receiver,message,image
        })

        if(!conversation){
            conversation=await Conversation.create({
                participants:[sender,receiver],
                messages:[newMessage._id]
            })
        }else{
            conversation.messages.push(newMessage._id)
            await conversation.save()
        }

        const receiverSocketId=getReceiverSocketId(receiver)
if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage",newMessage)
}


        
        return res.status(201).json(newMessage)
    
    } catch (error) {
        return res.status(500).json({message:`send Message error ${error}`})
    }
}

export const getMessages=async (req,res)=>{
    try {
        let sender=req.userId
        let {receiver}=req.params
        let conversation=await Conversation.findOne({
            participants:{$all:[sender,receiver]}
        }).populate("messages")

        return res.status(200).json(conversation?.messages || [])
    } catch (error) {
        return res.status(500).json({message:`get Message error ${error}`})
    }
}

// AI Smart Reply Suggestions
// Takes the last received message text and asks an LLM (OpenAI) for
// 3 short, casual reply suggestions the user can tap instead of typing.
export const getSmartReplies = async (req, res) => {
    try {
        let { message } = req.body

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ message: "message text is required to generate suggestions" })
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "GEMINI_API_KEY is not set on the server" })
        }

        const prompt = `You suggest quick chat replies. Given the last message a user received, reply with exactly 3 short, casual reply suggestions (each under 6 words). Separate them with the '|' character. Do not add numbering, quotes, or any explanation.\n\nMessage: "${message}"`

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            }
        )

        const data = await response.json()

        if (!response.ok) {
            console.log("Gemini error:", data)
            return res.status(500).json({ message: "Failed to generate suggestions" })
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
        const suggestions = text
            .split("|")
            .map(s => s.trim())
            .filter(Boolean)
            .slice(0, 3)

        return res.status(200).json({ suggestions })

    } catch (error) {
        return res.status(500).json({ message: `smart reply error ${error}` })
    }
}