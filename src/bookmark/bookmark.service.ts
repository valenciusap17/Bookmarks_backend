import { Injectable } from '@nestjs/common';
import { CreateBookmarkDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';

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
}
