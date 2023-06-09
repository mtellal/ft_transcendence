import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UserRequestDto, FriendshipDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2';
import { Prisma, ChannelType, FriendRequest, User, Status, GameType, GameStatus } from '@prisma/client';
import * as fs from 'fs';
import { UsersGateway } from './users.gateway';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findbyUsername(username: string) {
    return await this.prisma.user.findUnique({where: {username}})
  }

  async getFriends(friendIds: number[]) {
    return await this.prisma.user.findMany({
      where: {id: {in: friendIds}},
      select: {
        id: true,
        username: true,
        avatar: true,
        userStatus: true,
      }
    })
  }

  async getFriendRequest(user: User) {
    return await this.prisma.friendRequest.findMany({
      where: {userId: user.id}
    })
  }

  async checkFriendRequest(senderId: number, receiverId: number): Promise<FriendRequest> {
    return await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { sendBy: senderId, userId: receiverId },
          { sendBy: receiverId, userId: senderId },
        ],
        status: false,
      }
    })
  }

  async acceptFriendRequest(userId: number, requestId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        friendRequest: true
      }
    })
    const friendRequest = user.friendRequest.find((request) => request.id === requestId)
    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }

    const newFriend = await this.prisma.user.update({
      where: { id: friendRequest.sendBy },
      data: {
        friendList: {
          push: userId,
        }
      }
    })
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        friendList: {
          push: friendRequest.sendBy
        },
        friendRequest: {
          delete: [{ id: friendRequest.id }]
        }
      },
    })
    return newFriend;
  }

  async deleteFriendRequest(userId: number, requestId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        friendRequest: true
      }
    })
    const friendRequest = user.friendRequest.find((request) => request.id === requestId)
    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        friendRequest: {
          delete: [{ id: friendRequest.id }]
        }
      },
    })
  }

  async sendFriendRequest(friend: User, user: User) {
    const newRequest = await this.prisma.friendRequest.create({
      data: {
        sendBy: user.id,
        userId: friend.id,
      }
    })
    await this.prisma.user.update({
      where: { id: friend.id },
      data: {
        friendRequest: { connect: { id: newRequest.id } }
      }
    })
    return newRequest;
  }

  async getBlocklist(userId: number) {
    return await this.prisma.blockedUser.findMany({
      where: {blockedBy: userId},
      select: {
        userId: true,
        createdAt: true
      }
    })
  }

  async getMatchHistory(userId: number) {
    return await this.prisma.game.findMany({
      where: {
        OR: [
          {
            player1Id: userId,
          },
          {
            player2Id: userId,
          }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async getStats(userId: number) {
    return await this.prisma.stats.findUnique({
      where: {userId}
    });
  }

  async checkifUserblocked(userId: number, blockedId: number) {
    const isBlocked = await this.prisma.blockedUser.findFirst({
      where: {
        blockedBy: userId,
        userId: blockedId
    }})
    if (!isBlocked) {
      return false
    }
    return true;
  }

  async blockUser(user: User, blockedUser: number) {
    const newBlock = await this.prisma.blockedUser.create({
      data: {
        blockedBy: user.id,
        userId: blockedUser
      }
    })
    await this.prisma.user.update({
      where: {id: user.id},
      data: {
        blockedList: {connect: {id: newBlock.id}}
      }
    })
    return newBlock;
  }

  async unblockUser(user: User, unblockedUser: number) {
    const blockedRequest = await this.prisma.blockedUser.findFirst({
      where: {
        blockedBy: user.id,
        userId: unblockedUser
      }
    })
    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        blockedList: {
          delete: [{id:blockedRequest.id}]
        }
      }
    })
  }

  async addFriend(id: number, friendId: number)
  {
    return await this.prisma.user.update({
      where: { id },
      data: { friendList: {push: friendId}}
    })
  }

  async removeFriend(id: number, friendId: number)
  {
    const user = await this.prisma.user.findUnique({where: {id}});
    const newFriendlist = user.friendList.filter(id => id !== friendId);
    return await this.prisma.user.update({
      where: {id},
      data: {friendList: newFriendlist},
    });
  }

  async getChannels(id: number) {
    return await this.prisma.channel.findMany({
      where: {
        members: {
          has: id
        }
      },
      include: {
        muteList: true
      }
    })
  }

  async getWhispers(friendshipDto: FriendshipDto) {
    return await this.prisma.channel.findFirst({
      where : {
        type: {
          equals: ChannelType.WHISPER
        },
        members: {
          hasEvery: [friendshipDto.id, friendshipDto.friendId]
        }
    }})
  }

  async getUsersByEloRating() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        avatar: true,
        userStatus: true,
        stats: {
          select: {
            eloRating: true,
            matchesPlayed: true,
            matchesWon: true,
            matchesLost: true,
            winStreak: true,
          }
        }
      },
      orderBy: {
        stats: {
          eloRating: 'desc',
        }
      }
    })
    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password)
      updateUserDto.password = await argon.hash(updateUserDto.password);
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      const updatedFriendList = await this.prisma.user.findMany({
        where: {
          id: {
            in: updatedUser.friendList
          },
          userStatus: Status.ONLINE
        }
      })
      return updatedUser;
    }
    catch (PrismaClientKnownRequestError) {
      if (PrismaClientKnownRequestError.code === 'P2002') {
        throw new ForbiddenException('Username is already taken');
      }
      throw new ForbiddenException(PrismaClientKnownRequestError);
    }
  }

  async getUpdatedFriendList(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {id}
    })
    const friendList = user.friendList;
    return await this.prisma.user.findMany({
      where: {
        id: {
          in: friendList
        },
        userStatus: Status.ONLINE
      }
    })
  }

  async remove(id: number) {
    let user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (user)
      return this.prisma.user.delete( {
        where : { id },
      });
    else
      throw new ForbiddenException('User doesn\'t exists or has already been deleted');
  }

  async deletePendingGames(userId: number) {
    await this.prisma.game.deleteMany({
      where: {player1Id: userId,
      status: GameStatus.INVITE},
    });
  }

  async deleteImg(filePath: string): Promise<void> {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return;
      }
    });
  }

}
