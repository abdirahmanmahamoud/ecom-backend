import "dotenv/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
  region: process.env.AWS_REGION,
});

export const uploadImageToS3 = async (file: any, key?: string) => {
  try {
    const KeyFile = crypto.randomBytes(16).toString("hex");
    const uploadKey = key ? key : KeyFile;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uploadKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    const response = await s3.send(command);

    return {
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadKey}`,
      key: uploadKey,
    };
  } catch (error: any) {
    return error.message;
  }
};
