/*  required infos to display a friend */

enum Status {

    onLine,
    disconnected,
    inGame

}

enum Access {
    public,
    private,
    protected
}


/*      /////////   C O N V E R S A T I O N  /////////   */  

type Message = {
    id: number,
    author: string,
    message: string
}

type Invitation = {
    author: string,
    to: number | User | Conversation // id to friend or group where the invitation is send
}

type Block = {
    author: string,
    to: number | User 
}

// A conversation is an array of messages/invitations/block events
// in chronological period 
type Conversation = [
    Message | Invitation | Block
]

/*      /////////   C H A N N E L   /////////   */ 

type Channel = {
    owner: User,
    administrators: number[] | User[],
    members: number[] |User[],
    conversation: Conversation,
    access: Access
    password: string, // if channel protected or private
    banMembers: number[] | User[],
    muteMembers: "sah aucune idee" 
    /* 
        Un utilisateur qui est administrateur d’un channel peut expulser, bannir ou
        mettre en sourdine (pour un temps limité) d’autres utilisateurs, mais pas les
        propriétaires du channel.
    */
}

/*      /////////   G A M E  /////////  PAS UNE PRIO POUR L'INSTANT */  

type Ball = {
    x: number,
    y: number,
    radius: number
}

type Player = {
    x: number,
    y: number,
    height: number,
    width: number,
    score: number
}

type Game = {
    player1: Player,
    player2: Player,
    ball: Ball,
}


/*      /////////   U S E R   /////////   */ 

type User = {
    id: number,
    name: string,
    img: string,
    status: Status,
    channelList: number[] | Channel[],
    friendList: number[] | User[], // array of ids/ Users
    convList: number[] | Conversation[], // or find a better way to get a conversation from a specific friend
    blockList: number[] | User[]
}
