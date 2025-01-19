import { Avatar, Box, Button, Typography, IconButton } from '@mui/material'

import { useAuth } from '../context/AuthContext'
import { red } from '@mui/material/colors'
import ChatItem from '../components/chat/Chatitem';
import { IoMdSend } from "react-icons/io";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { deleteUserChats, getUserChats, sendChatRequest } from '../helpers/api-communicator';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type Message={
    role:"user" | "assistant";
    content:string;
}
const Chat = () => {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const auth = useAuth()
  const [chatMessages, setChatsMessages] = useState<Message[]>([])
  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if(inputRef && inputRef.current) {
      inputRef.current.value = '';
    }
    const newMessage: Message = {role:'user', content};
    setChatsMessages((prev)=>[...prev, newMessage])

    const chatData = await sendChatRequest(content);
    setChatsMessages([...chatData.chats])
  }

  const handleDeleteChats = async () => {
    try {
      toast.loading('Deleting Chats', {id: 'deletechats'})
      await deleteUserChats();
      setChatsMessages([])
      toast.success('Deleted Chats Successfully', {id: 'deletechats'})
    } catch (error) {
      console.log(error)
      toast.error("Deleted Chats Failed", { id: 'deletechats' });
    }
  }




  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: 'loadchats' });
      getUserChats()
        .then((data) => {
          setChatsMessages([...data.chats]);
          toast.success("Successfully loaded chats", { id: 'loadchats' });
        })
        .catch((err) => {  // Added parentheses around 'err'
          console.log(err);
          toast.error("Loading Failed", { id: 'loadchats' });
        });
    }
  }, [auth]);

  useEffect(() => {
    if(!auth?.user){
      return navigate("/login")
    }
  

  }, [auth])
  
  
  return (
    <Box sx={{display:'flex', flex:1, width:'100%', height:'100%',mt:3, gap:3}}>
      <Box sx={{display:{md:'flex', xs:'none', sm:'none'},width:"30%", flex:0.2, flexDirection:"column"}}>
        <Box sx={{display:'flex', width:"100%", height:'60vh', flexDirection: "column", bgcolor:'rgb(17,29,39)', borderRadius: 5, flex:'column', mx:3}}>
          <Avatar sx={{mx:'auto', my:2, bgcolor:'white', color:'black',fontWeight:700}}>
            {auth?.user?.name[0]} 
            {auth?.user?.name.split(' ')[1][0]}
            </Avatar>
            <Typography sx={{mx:'auto', fontFamily:'work sans'}}>
              You are talking to ChatBot
            </Typography>
            <Typography sx={{mx:'auto', fontFamily:'work sans', my:4, p:3}}>
              You can ask some questions related to knowledge, Business, Advices, Education, etc. But avoid sharing personal information
            </Typography>
            <Button 
            onClick={handleDeleteChats}
            sx={{width:'200px',
             my:'auto',
              color:'white', 
              fontWeight:'700',
              borderRadius:'3',
              mx:'auto',
               bgcolor: red[300],
               ':hover':{
              bgcolor: red.A400
             
            }}}>
              CLEAR CONVERSATION
            </Button>
        </Box>
      </Box>
      <Box sx={{display: 'flex',width:"70%", flex:{md:0.8, xs:1, sm:1},  flexDirection:'column', pl:3}}>
        <Typography sx={{  fontSize:'40px', color:'white', mb:2,fontWeight:'600', mx:"auto"}}>
          Model - GPT 3.5 Turbo
        </Typography>
            <Box sx={{ width:'100%', overflowY:'auto', height:'60vh', borderRadius:3, mx:'auto', display:'flex', flexDirection:'column', overflow:'scroll', overflowX:'hidden', scrollBehavior: "smooth"}}
            >
              {chatMessages.map((chat, index)=> (
                //@ts-ignore
                <ChatItem content={chat.content} role={chat.role} key={index}/>))}
            </Box>
            <div style={{width:'96.5%', padding:'20px', borderRadius:8, backgroundColor:'rgb(17,27,39)',display:'flex',marginRight:'auto', }}>
              <input ref={inputRef} type="text" style={{width: '100%', background:'transparent',padding:'10px', border:'none', outline:'none', color:'white', fontSize:'20px', }} />
              <IconButton onClick={handleSubmit} sx={{ml:'auto',color:'white'}}><IoMdSend /></IconButton>
            </div>
      </Box>
    </Box>
  )
}

export default Chat
