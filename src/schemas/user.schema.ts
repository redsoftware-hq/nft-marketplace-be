/* eslint-disable prettier/prettier */
import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

const mintNftSchema = new mongoose.Schema({
  createdAt: Date,
  title: String,
  description: String,
  nftIpfsURL: String,
  nftIpfsMetadataURL: String,
});

const transactionSchema = new mongoose.Schema({
  createdAt: Date,
  trxHash: String,
  tokenId: Number
});

@Schema()
export class User {
  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  nftIpfsURL: string;

  @Prop()
  nftIpfsMetadataURL: string;

  // @Prop({ type: [mintNftSchema] })
  // mintNftData: [typeof mintNftSchema]

  // @Prop({ type: [transactionSchema] })
  // transactionData: [typeof transactionSchema]
}

export const UserSchema = SchemaFactory.createForClass(User);