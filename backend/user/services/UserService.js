const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Utility = require("../utils/Utility");
const  UserDAO  = require("../dao/UserDao");
const { BadRequestError, NotFoundError } = require("../../errors");
const logger = require("../../logger/logger");

class UserService {
  static async getUserProfile(username, currentUserId) {
    const user = await UserDAO.findUserByQuery(
      { username },
      {
        exclude: ["password", "updatedAt"],
      }
    );

    if (!user) throw new NotFoundError("User not found ");

    // const count_follows = await Follow.count({
    //   where: { followerId: user.id },
    // });
    // const count_followers = await Follow.count({
    //   where: { followingId: user.id },
    // });

    let isProfile = user.id === currentUserId;
    logger.debug("user profile", user, isProfile);
    return {
      body: {
        user,
        //count_follows,
        //count_followers,
        isProfile,
      },
    };
  }

  static async login(username, password) {
    let user = await UserDAO.findUserByQuery({ username });
    if (!user) throw new NotFoundError("User not found");
    const verifyPass = await bcryptjs.compare(password, user.password);
    if (!verifyPass)
      throw new NotFoundError("Verification Password not matched");

    //JWT
    const payload = { id: user.id, username: user.username, tags: user.tags };
    const token = jwt.sign(payload, process.env.SIGNATURE_TOKEN, {
      expiresIn: 86400,
    });
    logger.debug("token:", token);

    return { body: { token } };
  }

  static async registerUser({name, email, username, password}) {
    let user = await UserDAO.findUserByEmailOrUsername(email, username);
    console.log("existing user", user);
    if (user) {
      if (user.email === email) {
        throw new BadRequestError("email already exists");
      }
      if (user.username === username) {
        throw new BadRequestError("username already exists");
      }
    }

    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    user = await UserDAO.createUser({
      name,
      email,
      username,
      password: passwordHash,
    });

    // JWT
    const payload = { id: user.id, username: user.username, tags: user.tags };
    const token = jwt.sign(payload, process.env.SIGNATURE_TOKEN, {
      expiresIn: 86400,
    });

    return { body: { token } };
  }

  static async getUserById(userId, attributes) {
    const user = await UserDAO.findUserById(userId, attributes);
    if (!user) {
      throw new NotFoundError("User not found.");
    }
    return user;
  }

  //method to find user by username
  static async getUserByUsername(username) {
    const user = await UserDAO.findUserByQuery({ username });
    if (!user) {
      throw new NotFoundError("User not found.");
    }
    return user;
  }

  //method to update password
  static async updatePassword({
    reqUser,
    password,
    passwordOld,
    passwordConfirm,
  }) {
    const user = await UserDAO.findUserById(reqUser.userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (!(await bcryptjs.compare(passwordOld, user.password))) {
      throw new BadRequestError("Old password does not match.");
    }

    if (password !== passwordConfirm) {
      throw new BadRequestError("Passwords do not match.");
    }

    // Hashing the new password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    const updatedUser = await UserDAO.updateUser(user.id, {
      password: passwordHash,
    });

    return updatedUser;
  }

  static async updateUserProfile(userId, profileData) {
    const user = await UserDAO.findUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatedFields = await Utility.updateChangedFields(profileData, user);

    if (profileData.tags != null) {
      const deltaTagsSet = Utility.findDeltaBetwn2Sets(
        new Set(profileData.tags),
        new Set(user.tags)
      );
      logger.debug("tags", profileData.tags, deltaTagsSet);
      if (deltaTagsSet.size > 0) {
        updatedFields.tags = profileData.tags;
      }
    }

    if (profileData.langPrefs != null) {
      const deltaLangPrefsSet = Utility.findDeltaBetwn2Sets(
        new Set(profileData.langPrefs),
        new Set(user.langPrefs)
      );
      logger.debug("langPrefs", profileData.langPrefs, deltaLangPrefsSet);
      if (deltaLangPrefsSet.size > 0) {
        updatedFields.langPrefs = profileData.langPrefs;
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    return await UserDAO.updateUser(userId, updatedFields);
  }

  static async updateUser(userId, updateData) {
    const user = await UserDAO.findUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }
    if (updateData.password) {
      updateData.password = await bcryptjs.hash(updateData.password, 8);
    }
    await user.update(updateData);
    return user;
  }

  static async deleteUser(userId) {
    const user = await UserDAO.findUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }
    await user.destroy();
  }
}

module.exports = UserService;
