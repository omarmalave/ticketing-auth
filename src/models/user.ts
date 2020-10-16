import * as mongoose from 'mongoose';
import PasswordManager from '../services/password-manager';

// Describes the props required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// Describes the props a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// Describes the User Model props
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line no-param-reassign,no-underscore-dangle,@typescript-eslint/no-unused-vars
      ret = { id: ret._id, email: ret.email };
    },
  },
});

// eslint-disable-next-line func-names
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});
// this has to be defined before User, otherwise it won't work
// eslint-disable-next-line @typescript-eslint/no-use-before-define
userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;
