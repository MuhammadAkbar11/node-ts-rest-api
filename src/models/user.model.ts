import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface IUserInput {
  email: string;
  name: string;
  password: string;
}

export interface UserDocument extends IUserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePw: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  user.password = await bcrypt.hashSync(user.password, salt);

  return next();
});

userSchema.methods.comparePassword = async function (candidatePw: string) {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePw, user.password).catch(_e => false);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema, "users");

export default UserModel;
