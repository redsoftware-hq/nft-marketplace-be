/* eslint-disable prettier/prettier */
import { S3 } from 'aws-sdk';
import { Model } from 'mongoose';
import * as FormData from "form-data";
import { lastValueFrom, map } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService, @InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

  getHello(): string {
    return 'Server Pinged';
  }

  async getNfts(): Promise<any> {
    const nfts = await this.userModel.find();
    return nfts
  }

  async uploadToPinata(req: any, username: string, title: string, description: string) {
    const form = new FormData();
    const pinataApiKey = '578e0a33215e231d9b80';
    const pinataSecretApiKey = '56abb5f343894cb9d662b2e4cd63687deb706a06ae64ed5dc7874823b46e0f28';

    form.append('file', req.file.buffer, req.file.originalname);
    form.append(
      'pinataOptions',
      JSON.stringify({
        pinataMetadata: {
          title,
          description,
          username: username,
          createdAt: new Date(),
        },
      }),
    );

    try {
      const pinImage = this.httpService
        .post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
          maxContentLength: 999999999,
          headers: {
            'Content-Type': 'multipart/form-data',
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey
            ,
          },
        })
        .pipe(map((res: any) => res.data));
      const pinataData: any = await lastValueFrom(pinImage);

      const metadataBody = {
        title,
        description,
        modelUrl: `https://gateway.pinata.cloud/ipfs/${pinataData.IpfsHash}?filename=${req.file.originalname}`,
      };

      const pinMetadata = this.httpService
        .post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadataBody, {
          maxContentLength: 999999999,
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
            'Content-Type': 'application/json'
          },
        })
        .pipe(map((res: any) => res.data));
      const pinataMetadata: any = await lastValueFrom(pinMetadata);

      const saveData = {
        createdAt: new Date(),
        updatedAt: new Date(),
        title: metadataBody.title,
        description: metadataBody.description,
        nftIpfsURL: `https://gateway.pinata.cloud/ipfs/${pinataData.IpfsHash}`,
        nftIpfsMetadataURL: `https://gateway.pinata.cloud/ipfs/${pinataMetadata.IpfsHash}`,
      }

      const newUser = new this.userModel(saveData);

      await newUser.save();

      // const mongo = await this.userModel.updateOne({ name: username }, {
      //   updatedAt: new Date(),
      //   $push: {
      //     mintNftData: {
      //       createdAt: new Date(),
      //       title: metadataBody.title,
      //       description: metadataBody.description,
      //       nftIpfsURL: `https://gateway.pinata.cloud/ipfs/${pinataData.IpfsHash}`,
      //       nftIpfsMetadataURL: `https://gateway.pinata.cloud/ipfs/${pinataMetadata.IpfsHash}`,
      //     }
      //   }
      // });

      return {
        createdAt: new Date(),
        title: metadataBody.title,
        description: metadataBody.description,
        nftIpfsURL: `https://gateway.pinata.cloud/ipfs/${pinataData.IpfsHash}`,
        nftIpfsMetadataURL: `https://gateway.pinata.cloud/ipfs/${pinataMetadata.IpfsHash}`,
      }
    } catch (err) {
      console.log('error', err);
    }
  }

  async uploadToS3(req: any) {
    const bucketS3 = 'photoshot-app';
    const data: Record<string, any> = await this.uploadS3(req.file.buffer, bucketS3, req.file.originalname);

    console.log('data', data);

    return data;
  }

  async uploadS3(file: any, bucket: string, name: any) {
    const s3 = new S3({
      accessKeyId: 'AKIAVM6PLOCFTG73FRM3',
      secretAccessKey: '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',
    });

    const params = {
      Body: file,
      Bucket: bucket,
      Key: String(name),
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err: { message: any; }, data: unknown) => {
        err ? reject(err.message) : resolve(data);
      });
    });
  }
}
