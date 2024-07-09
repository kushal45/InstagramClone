const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const Utility = require("../utils/Utility");

class UserService {
  async getUserProfile(username, currentUserId) {
    const user = await User.findOne({
      where: { username },
      attributes: {
        exclude: ["password", "updatedAt"],
      },
    });

    if (!user) {
      return { status: 404, body: { message: "User not found " } };
    }


    const count_follows = await Follow.count({ where: { followerId: user.id } });
    const count_followers = await Follow.count({ where: { followingId: user.id } });

    let isProfile = user.id === currentUserId;

    return {
      status: 200,
      body: {
        user,
        count_follows,
        count_followers,
        isProfile
      },
    };
  }

  async login(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return { status: 400, body: { errors: errors.array() } };
    }

    const { username, password } = req.body;
    let user = await User.findOne({ where: { username } });
    if (!user) return { status: 400, body: { message: "User incorrect" } };

    const verifyPass = await bcryptjs.compare(password, user.password);
    if (!verifyPass)
      return { status: 400, body: { message: "Verification Password not matched" } };

    //JWT
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.SIGNATURE_TOKEN, { expiresIn: 86400 });

    return { status: 200, body: { token } };
  }

  async registerUser(req) {
    const { name, email, username, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return { status: 400, body: { errors: errors.array() } };
    }

    let user = await User.findOne({
      where: { [Sequelize.Op.or]: [{ email }, { username }] },
    });

    if (user) {
      if (user.email === email) {
        return { status: 400, body: { message: "email already exists" } };
      }
      if (user.username === username) {
        return { status: 400, body: { message: "username already exists" } };
      }
    }

    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    user = await User.create({
      name,
      email,
      username,
      password: passwordHash,
    });

    // JWT
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.SIGNATURE_TOKEN, {
      expiresIn: 86400,
    });

    return { status: 200, body: { token } };
  }

  async getUserById(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  }

  //method to find user by username
  async getUserByUsername(username) {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  }

  //method to update password
  async updatePassword(reqUser, password, password_old, password_confirm) {
    const user = await User.findByPk(reqUser.userId);

    if (!user) {
      throw new Error("User not found.");
    }

    if (!(await bcryptjs.compare(password_old, user.password))) {
      throw new Error("Old password does not match.");
    }

    if (password !== password_confirm) {
      throw new Error("Passwords do not match.");
    }

    // Hashing the new password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    await User.update({ password: passwordHash }, { where: { id: userId } });

    return { message: "Password updated successfully." };
  }

  async updateUserProfile(userId, profileData) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedFields = await Utility.updateChangedFields(profileData, user);

    if (profileData.tags != null) {
      const deltaTagsSet = Utility.findDeltaBetwn2Sets(
        new Set(profileData.tags),
        new Set(user.tags)
      );
      console.log("tags", profileData.tags, deltaTagsSet);
      if (deltaTagsSet.size > 0) {
        updatedFields.tags = profileData.tags;
      }
    }

    if (profileData.langPrefs != null) {
      const deltaLangPrefsSet = Utility.findDeltaBetwn2Sets(
        new Set(profileData.langPrefs),
        new Set(user.langPrefs)
      );
      console.log("langPrefs", profileData.langPrefs, deltaLangPrefsSet);
      if (deltaLangPrefsSet.size > 0) {
        updatedFields.langPrefs = profileData.langPrefs;
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      throw new Error("No fields to update");
    }

    await User.update(updatedFields, { where: { id: userId } });
    return { message: "Profile updated successfully" };
  }

  async updateUser(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found.");
    }
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 8);
    }
    await user.update(updateData);
    return user;
  }

  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found.");
    }
    await user.destroy();
    return { message: "User deleted successfully." };
  }
}

module.exports = new UserService();
