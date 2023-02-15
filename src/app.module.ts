/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    HttpModule.register({
      timeout: 120000000,
    }), MongooseModule.forRoot('mongodb://ai-nft-mongo:27017', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      readPreference: "secondaryPreferred"
    }), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
