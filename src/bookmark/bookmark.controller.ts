import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateBookmarkDTO } from './dto';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator/user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(
    private bookmarkService: BookmarkService,
  ) {}
  @Post('create')
  CreateBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDTO,
  ) {
    return this.bookmarkService.createBookmark(
      userId,
      dto,
    );
  }

  GetAllBookmark() {}

  GetBookmarkById() {}

  EditBookmarkById() {}

  DeleteBookmarkById() {}
}
