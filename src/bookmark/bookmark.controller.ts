import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateBookmarkDTO } from './dto';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator/user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { EditBookmarkDto } from './dto/EditBookmark.dto';

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

  @Get()
  GetAllBookmark(@GetUser('id') userId: number) {
    return this.bookmarkService.getAllBookmark(
      userId,
    );
  }

  @Get(':id')
  GetBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarById(
      userId,
      bookmarkId,
    );
  }

  @Patch(':id')
  EditBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(
      userId,
      bookmarkId,
      dto,
    );
  }

  @Delete(':id')
  DeleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(
      userId,
      bookmarkId,
    );
  }
}
