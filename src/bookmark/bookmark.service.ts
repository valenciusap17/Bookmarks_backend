import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateBookmarkDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { EditBookmarkDto } from './dto/EditBookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async createBookmark(
    userId: number,
    dto: CreateBookmarkDTO,
  ) {
    const bookmark =
      await this.prismaService.bookmark.create({
        data: {
          userId,
          ...dto,
        },
      });
    return bookmark;
  }

  async getAllBookmark(userId: number) {
    const allBookmark =
      await this.prismaService.bookmark.findMany({
        where: {
          userId: userId,
        },
      });
    return allBookmark;
  }

  async getBookmarById(
    userId: number,
    bookmarkId: number,
  ) {
    const bookmark =
      await this.prismaService.bookmark.findFirst(
        {
          where: {
            userId: userId,
            id: bookmarkId,
          },
        },
      );
    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    const bookmark =
      await this.prismaService.bookmark.findUnique(
        {
          where: {
            id: bookmarkId,
          },
        },
      );

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    const editedBookmark =
      await this.prismaService.bookmark.update({
        where: {
          id: bookmarkId,
        },
        data: {
          ...dto,
        },
      });

    return editedBookmark;
  }

  async deleteBookmarkById(
    userId: number,
    bookmarkId: number,
  ) {
    const deletedBookmark =
      this.prismaService.bookmark.delete({
        where: {
          userId: userId,
          id: bookmarkId,
        },
      });
    return deletedBookmark;
  }
}
