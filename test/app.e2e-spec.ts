import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDTO } from 'src/bookmark/dto';
import { EditBookmarkDto } from 'src/bookmark/dto/EditBookmark.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );
  });

  afterAll(() => {
    app.close();
  });

  describe('auth', () => {
    const dto: AuthDto = {
      email: 'v.apriady@gmail.com',
      password: '123',
    };
    describe('sign up', () => {
      it('should throw error if the email is empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw error if the password is empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw error if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .expectStatus(400);
      });

      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('sign in', () => {
      it('should throw error if the email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw error if the password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw error if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAT', 'access_token');
      });
    });
  });

  describe('User', () => {
    const dto: EditUserDto = {
      email: 'sonikesuma@gmail.com',
      firstname: 'Soni',
    };
    describe('Get Me', () => {
      it('should get User info', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200)
          .inspect();
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200);
      });
    });
  });

  describe('Bookmarks', () => {
    const dto: CreateBookmarkDTO = {
      title: 'siak',
      link: 'www.academic.ui.ac.id',
    };
    describe('Create Bookmarks', () => {
      it('should create a bookmark', () => {
        return pactum
          .spec()
          .post('/bookmark/create')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .withBody(dto)
          .stores('bookmarkId', 'id')
          .expectStatus(201);
      });
    });

    describe('get bookmark', () => {
      it('should get all bookmark', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200);
      });
    });

    describe('get bookmark by id', () => {
      it('should get the bookmarks based on id', () => {
        return pactum
          .spec()
          .get('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .inspect();
      });
    });

    describe('Edit Bookmark', () => {
      const dto: EditBookmarkDto = {
        title: 'naruto',
        description: 'Saya suka banget',
        link: 'https://www.youtube.com/watch?v=GHTA143_b-s&t=12455s',
      };
      it('should successfully edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Delete Bookmark', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200);
      });
    });
  });
});
