import AWS from "aws-sdk";
import fs from "fs";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadOnS3 = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    console.log("localFilePath", localFilePath);

    // Read the file
    const fileContent = fs.readFileSync(localFilePath);

    // Upload the file to the S3 bucket
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${Date.now()}_${localFilePath.split("/").pop()}`,
      Body: fileContent,
    };
    const response = await s3.upload(params).promise();

    // File has been uploaded successfully
    console.log("File is uploaded on S3 ", response.Location);

    // Remove the locally saved temporary file
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // Remove the locally saved temporary file as the upload operation failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnS3 };
