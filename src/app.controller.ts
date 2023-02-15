/* eslint-disable prettier/prettier */
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import {
  Get,
  Req,
  Res,
  Post,
  Param,
  Query,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/uploadToPinata')
  @UseInterceptors(FileInterceptor('filename'))
  async uploadToPinata(@Query('title') title: string, @Query('description') description: string, @Query('username') username: string, @Req() req: Request) {
    return await this.appService.uploadToPinata(req, username, title, description);
  }

  @Post('/uploadToS3')
  @UseInterceptors(FileInterceptor('filename'))
  async uploadToS3(@Req() req: Request) {
    return await this.appService.uploadToS3(req);
  }

  @Get('/getNfts')
  getNfts() {
    return this.appService.getNfts();
  }
}
