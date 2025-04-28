import mongoose from "mongoose";
// /import SellerSchema from "../models/registerSeller.model";

const connectDatabase = (): void => {
  mongoose
    .connect(process.env.MONGO_URL as string)
    .then(() => {
      console.log(`MongoDB connected with server: ${mongoose.connection.host}`);
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

// const createTestSeller = async () => {
//   const testSeller = new SellerSchema({
//     email: "testseller@example.com",
//     password: "hashed_password",
//     role: "seller",
//     phoneNumber: 1234567890,
//     country: "India",
//     access_level: "1",
//     status: "active",
//     documentVerification: {
//       status: 'inactive',
//       documents: [
//         { name: "Aadhar", url: "http://example.com/aadhar.pdf" },
//         { name: "PAN", url: "http://example.com/pan.pdf" }
//       ],
//       aadharNumber: "1234-5678-9012",
//       panNumber: "ABCDE1234F",
//       gstin: "22ABCDE1234F1Z5",
//       ifscCode: "SBIN0001234",
//       accountNumber: "123456789012",
//     },
//   });

//   await testSeller.save();
//   console.log('Test seller created successfully');
//   mongoose.connection.close(); 
// };

// createTestSeller().catch(err => {
//   console.error(err);
//   mongoose.connection.close();
// });

export default connectDatabase;
