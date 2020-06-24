const users =[]

//addUser,removeUser,getUser,getUsersInRoom

const addUser =({id,username,room }) =>{
    //clean the data
    username = username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    if(!username || !room){
        return{
            error:'username and room are required'
        }
    }

    //check for existing users
    const existingUser = users.find((user) =>{
        return user.room === room && user.username === username
    })

    if(existingUser){
        return{
            error:'username is in use!'
        }
    }
    //Store user
    const user ={ id,username,room}
    users.push(user)
    return{user}

}

const removeUser =(id)=>{
    const index = users.findIndex((user) => user.id ==id
    // {
    //     return user.id ===id
    // }
    )
    if(index !==-1){
        return users.splice(index,1)[0]
    }

}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports ={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}