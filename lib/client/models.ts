import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FriendsSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    friends: [
      {
        _id: Schema.Types.ObjectId,
        Id: Schema.Types.ObjectId,
        Name: String,
        Image: String,
        LastPersonToSendMessage: Schema.Types.ObjectId,
        UnseenMessages: Number,
        Last_Message: String,
        IsPrivate: Boolean,
      },
    ],
  },
  {
    collection: "Friends",
  }
);

const SettingSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    user: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    settings: {
      type: Array,
      require: true,
    },
  },
  {
    collection: "Settings",
  }
);

const UsersSchema = new Schema(
  {
    FullName: {
      type: String,
      required: true,
    },
    UserName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Gender: String,
    Settings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Settings",
      },
    ],
    Friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "Friends",
      },
    ],
    Notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notifications",
      },
    ],
    FriendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "FriendRequests",
      },
    ],
    Uploads: [
      {
        type: Schema.Types.ObjectId,
        ref: "Uploads",
      },
    ],
    Image: {
      profile: String,
      cover: String,
    },
    PendingRequests: {
      type: Array,
      default: [],
    },
    Online: {
      type: Boolean,
      default: false,
    },
    Last_Seen: String,
    All_Logins: {
      type: Array,
      default: [],
    },
    Coins: {
      type: Number,
      default: 0,
    },
    Account_Creation_Date: Date,
    DateOfBirth: Date,
  },
  {
    collection: "Users",
  }
);

const ActivitiesSchema = new Schema(
  {
    UserId: {
      type: String,
      required: true,
    },
    SocketId: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Activities",
  }
);

const MessagesSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    From: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    To: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    Message: [
      {
        _id: Schema.Types.ObjectId,
        Format: String,
        message: String,
        url: String,
        going: String,
        coming: String,
        filename: String,
        question: String,
        options: Array,
        date: Date,
        noAnswer: Boolean,
        answered: {},
        coin: Number,
        timer: Number,
      },
    ],
    VoiceCall: [],
    VideoCall: [],
  },
  {
    collection: "Messages",
  }
);

const FriendRequestsSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    requests: [],
  },
  {
    collection: "FriendRequests",
  }
);

const NotificationSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    notifications: [],
  },
  {
    collection: "Notifications",
  }
);

const UploadsSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    Uploader: {
      name: String,
      image: String,
    },
    type: String,
    Url: String,
    Caption: String,
    Mentions_Tags: Array,
    Feedback: {
      Likes: Array,
      Comments: Array,
      Shares: Array,
    },
  },
  {
    collection: "Uploads",
  }
);

const QuizSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    quizName: String,
    closeTime: Date,
    openTime: Date,
    Purpose: String,
    Password: String,
    Questions: Array,
  },
  {
    collection: "Quiz",
  }
);

export const Users =
  mongoose.models.Users || mongoose.model("Users", UsersSchema);
export const Activities =
  mongoose.models.Activities || mongoose.model("Activities", ActivitiesSchema);
export const Settings =
  mongoose.models.Settings || mongoose.model("Settings", SettingSchema);
export const Friends =
  mongoose.models.Friends || mongoose.model("Friends", FriendsSchema);
export const Messages =
  mongoose.models.Messages || mongoose.model("Messages", MessagesSchema);
export const Notifications =
  mongoose.models.Notifications ||
  mongoose.model("Notifications", NotificationSchema);
export const FriendRequests =
  mongoose.models.FriendRequests ||
  mongoose.model("FriendRequests", FriendRequestsSchema);
export const Uploads =
  mongoose.models.Uploads || mongoose.model("Uploads", UploadsSchema);
export const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);

// exports = {
//   Users,
//   Activities,
//   Settings,
//   Friends,
//   Messages,
//   Notifications,
//   FriendRequests,
//   Uploads,
//   Quiz,
// };