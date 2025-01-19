// import { Request, Response, NextFunction } from 'express'; 
// import User from '../models/User.js';
// import { configureOpenAi } from '../config/openai-config.js';
// import { OpenAIApi, ChatCompletionRequestMessage } from 'openai';

// export const generateChatCompletion = async(req:Request,res:Response,next:NextFunction) => {
//     const {message} = req.body;
//     console.log(req.body)
//     try {
        
//             const user = await User.findById(res.locals.jwtData.id)
//             if(!user) return res.status(401).json({message:'User not registered OR Token malfunctioned'})
            
//                 // grab chats of user
//             const chats = user.chats.map(({role,content}) => ({role, content})) as ChatCompletionRequestMessage[];
//             chats.push({content:message, role:'user'});
//             user.chats.push({content:message,role:'user'});
//                 //send all chats with new one to openAi Api
        
//                 const config = configureOpenAi()
//                 const openai = new OpenAIApi(config);
//                 const chatResponse = await openai.createChatCompletion({model:'gpt-4o-mini', messages: chats})
//                 user.chats.push(chatResponse.data.choices[0].message);
//                 await user.save()
//                 return res.status(200).json({chats:user.chats});
//                 // get latest response
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({message: 'Something went wrong'})
//     }
    
// }

import { Request, Response, NextFunction } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from '../models/User.js';

export const generateChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
    const { message } = req.body;
    console.log(req.body);
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) return res.status(401).json({ message: 'User not registered OR Token malfunctioned' });

        // Grab chats of user
        const chats = user.chats.map(({ role, content }) => ({ role, content }));
        chats.push({ content: message, role: 'user' });
        user.chats.push({ content: message, role: 'user' });

        // Send all chats with new one to Google Generative AI
        const genAI = new GoogleGenerativeAI("AIzaSyDuShQt0VMB57Wtx442Ba5yxv8rvMdzPxM");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chatHistory = chats.map(chat => `${chat.role}: ${chat.content}`).join("\n");
        const result = await model.generateContent(chatHistory);

        const botResponse = result.response.text();
        user.chats.push({ content: botResponse, role: 'assistant' });
        await user.save();

        return res.status(200).json({ chats: user.chats });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};


export const sendChatsToUser = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const user = await User.findById(res.locals.jwtData.id)
        if(!user) {
            return res.status(401).send("User not registered OR Token malfunctioned")
        }
        if(user._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Permissions didn't match")
        }

      return res.status(200).json({ message: "ok", chats:user.chats});
    } catch (error) {
        console.error("Error fetching users:", error); // Log the error for debugging
        return res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
}

export const deleteChats= async(req:Request,res:Response,next:NextFunction) => {
    try {
        const user = await User.findById(res.locals.jwtData.id)
        if(!user) {
            return res.status(401).send("User not registered OR Token malfunctioned")
        }
        if(user._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Permissions didn't match")
        }
        //@ts-ignore
        user.chats = [];
        await user.save()
      return res.status(200).json({ message: "ok"});
    } catch (error) {
        console.error("Error fetching users:", error); // Log the error for debugging
        return res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
}