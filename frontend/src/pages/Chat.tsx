import { Avatar, Box, Button, Typography } from '@mui/material'

import { useAuth } from '../context/AuthContext'

function Chat() {
  const auth = useAuth()
  return (
    <Box sx={{display:'flex', flex:1, width:'100%', height:'100%',mt:3, gap:3}}>
      <Box sx={{display:{md:'flex', xs:'none', sm:'none'}}}>
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
            <Button></Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Chat
