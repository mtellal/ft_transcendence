
export type User = {
    id: number,
    username: string,
    password?: string,
    email?: string,
    avatar?: string,
    userStatus: string,
    friendRequest?: FriendRequest[],
    friendList: number[],
    blockList: Block[],
    channelList: number[],
    createdAt?: string,

    url?: string,
    oauth_code?: any,
    oauth_exp?: any,
    twoFactorSecret?: any,
    twoFactorStatus?: any,
    twoFactorOtpUrl?: any
}

export type Channel = {
    id: number
    name?: string,
    password?: string,
    messages?: any[],
    ownerId: number,
    administrators: any[],
    members: number[],
    banList: number[],
    muteList: Mute[],
    type: string,
    createdAt?: string

    users?: User[],
}


export type Stat = {
    userId: number, 
    matchesPlayed: number, 
    matchesWon: number, 
    matchesLost: number,
    eloRating: number,
    winStreak: number,
    lossStreak: number,
    goalsScored: number,
    goalsTaken: number,    
}
  

export type Achievements = {
    userId: number, 
    Novice: boolean, 
    Intermediate: boolean,
    Expert: boolean,
    Master: boolean,
    OnFire: boolean,
    Tenacious: boolean,
    Godlike: boolean,
}

export type Block = {
    id: number, 
    blockedBy: number, 
    userId: number, 
    createdAt: any
}
  
export type FriendRequest = {
    id: number, 
    sendBy: number, 
    userId: number, 

}

export type Mute = {
    id: number, 
    userId: number, 
    duration: any, 
    channelId: number
}
  

export type Message = {
    id: number, 
    sendBy: number, 
    acceptedBy: number, 
    content: string,
    type: string, 
    channelId: number, 
    createdAt: any,
    
    gameType?: string,
}



export type Game = {
    id: number, 
    player1Id: number, 
    player1Score: number, 
    player2Id: number, 
    player2Score: number, 
    wonBy: number
    gametype: string,
    status?: string
}
