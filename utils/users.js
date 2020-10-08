const users = [];


//Join user to chat

function userJoin(id,username,room){
    const user={id,username,room};
    users.push(user);
    return user;
}

//Get current User

function getCurrentUser(id){
    return users.find(user=>user.id===id);
}

//User leaves

function userLeaves (id){
    const index=users.findIndex(user=>id===user.id)
    if(index!=-1){
        return users.splice(index,1)[0];
    }
}

//Get room users
function getRoomUsers(room){
    return users.filter(user=>user.room===room)
}
module.exports={
    getCurrentUser,
    userJoin,
    getRoomUsers,
 userLeaves 
    
}