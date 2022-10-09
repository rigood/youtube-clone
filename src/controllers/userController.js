import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

const isHeroku = process.env.NODE_ENV === "production";

export const getJoin = (req, res) => res.render("join", { pageTitle: "회원가입" });

export const postJoin = async (req, res) => {
  const { email, password, passwordConfirmation, nickname } = req.body;
  const pageTitle = "회원가입";

  if (password !== passwordConfirmation) {
    return res.status(400).render("join", { pageTitle, errorMsg: "비밀번호가 일치하지 않습니다." });
  }

  const duplicate = await User.exists({ email });
  if (duplicate) {
    return res.status(400).render("join", { pageTitle, errorMsg: "이미 사용 중인 이메일입니다." });
  }

  try {
    await User.create({
      email,
      password,
      nickname,
      avatarUrl: "/static/img/default.jpg",
    });
    req.flash("success", "🎉 회원가입이 완료되었습니다. 🎉");
    return res.redirect("/login");
  } catch (error) {
    console.log(error.errmsg);
    return res.status(400).render("join", { pageTitle, errorMsg: "회원가입에 실패했습니다." });
  }
};

export const getLogin = (req, res) => res.render("login", { pageTitle: "로그인" });

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const pageTitle = "로그인";

  const user = await User.findOne({ email, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", { pageTitle, errorMsg: "존재하지 않는 이메일입니다." });
  }

  const pwMatch = await bcrypt.compare(password, user.password);
  if (!pwMatch) {
    return res.status(400).render("login", { pageTitle, errorMsg: "비밀번호가 올바르지 않습니다." });
  }

  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "프로필 변경" });
};

export const postEdit = async (req, res) => {
  const pageTitle = "프로필 변경";
  const {
    session: {
      user: { _id, avatarUrl, email: oldEmail },
    },
    body: { email, nickname },
    file,
  } = req;

  if (file && file.size > 5000000) {
    return res.status(500).render("edit-profile", { pageTitle, errorMsg: "5MB 이하 이미지만 업로드 할 수 있습니다." });
  }

  if (email !== oldEmail) {
    const duplicate = await User.exists({ email });
    if (duplicate) {
      return res.status(400).render("edit-profile", { pageTitle, errorMsg: "이미 사용 중인 이메일입니다." });
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      email,
      nickname,
      avatarUrl: file ? (isHeroku ? file.location : file.path) : avatarUrl,
    },
    { new: true }
  );

  req.session.user = updatedUser;
  req.flash("success", "프로필이 변경되었습니다.");
  return res.redirect("/users/edit");
};

export const getChangePw = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "비밀번호 변경 대상이 아닙니다.");
    return res.redirect("/");
  }
  return res.render("change-pw", { pageTitle: "비밀번호 변경" });
};

export const postChangePw = async (req, res) => {
  const pageTitle = "비밀번호 변경";
  const {
    session: { user: _id },
    body: { oldPw, password, passwordConfirmation },
  } = req;

  const user = await User.findById(_id);

  const pwMatch = await bcrypt.compare(oldPw, user.password);
  if (!pwMatch) {
    return res.status(400).render("change-pw", { pageTitle, errorMsg: "기존 비밀번호가 일치하지 않습니다." });
  }

  if (password !== passwordConfirmation) {
    return res.status(400).render("change-pw", { pageTitle, errorMsg: "새로운 비밀번호가 일치하지 않습니다." });
  }

  if (oldPw === password) {
    return res.status(400).render("change-pw", { pageTitle, errorMsg: "기존 비밀번호와 새 비밀번호가 동일합니다." });
  }

  user.password = password;
  await user.save();
  req.session.user = null;
  req.session.loggedIn = false;
  req.flash("success", "비밀번호가 변경되었습니다.\n다시 로그인 해주세요.");
  return res.redirect("/login");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT_ID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const pageTitle = "로그인";
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT_ID,
    client_secret: process.env.GH_CLIENT_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailObj = emailData.find((email) => email.primary === true && email.verified === true);

    if (!emailObj) {
      return res.render("login", { pageTitle, errorMsg: "인증된 깃허브 이메일이 존재하지 않습니다" });
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        email: emailObj.email,
        nickname: userData.login,
        socialOnly: true,
        avatarUrl: userData.avatar_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.flash("success", "😀 환영합니다.");
    return res.redirect("/");
  } else {
    return res.render("login", { pageTitle, errorMsg: "다시 시도해주시기 바랍니다." });
  }
};

export const startKakaoLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_CLIENT_ID,
    redirect_uri: process.env.KAKAO_URI,
    response_type: "code",
    scope: "profile_nickname profile_image account_email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishKakaoLogin = async (req, res) => {
  const pageTitle = "로그인";
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_CLIENT_ID,
    redirect_uri: process.env.KAKAO_URI,
    code: req.query.code,
    client_secret: process.env.KAKAO_CLIENT_SECRET,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://kapi.kakao.com";
    const userData = await (
      await fetch(`${apiUrl}/v2/user/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    const userObj = userData.kakao_account;

    if (userObj.has_email === false || userObj.is_email_valid === false || userObj.is_email_verified === false) {
      return res.render("login", { pageTitle, errorMsg: "카카오 계정 이메일이 존재하지 않거나 유효하지 않습니다." });
    }

    let user = await User.findOne({ email: userObj.email });
    if (!user) {
      user = await User.create({
        email: userObj.email,
        nickname: userObj.profile.nickname,
        socialOnly: true,
        avatarUrl: userObj.profile.thumbnail_image_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.flash("success", "😀 환영합니다.");
    return res.redirect("/");
  } else {
    return res.render("login", { pageTitle, errorMsg: "다시 시도해주시기 바랍니다." });
  }
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id)
    .populate({
      path: "videos",
      populate: {
        path: "author",
      },
    })
    .populate({
      path: "comments",
      populate: {
        path: "video",
      },
    })
    .populate({
      path: "likes",
      populate: {
        path: "video",
      },
    })
    .populate({
      path: "subscribes",
      populate: {
        path: "video",
      },
    });
  if (!user) {
    return res.status(404).render("404", { pageTitle: "존재하지 않는 사용자입니다." });
  }

  return res.render("profile", { pageTitle: user.nickname, user });
};

export const like = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id)
    .populate({
      path: "likes",
      populate: {
        path: "video",
        populate: {
          path: "author",
        },
      },
    })
    .populate({
      path: "subscribes",
      populate: {
        path: "video",
      },
    });
  if (!user) {
    return res.status(404).render("404", { pageTitle: "존재하지 않는 사용자입니다." });
  }
  const likeList = user.likes;
  let videoList = [];
  likeList.map((like) => {
    videoList.push(like.video);
  });

  return res.render("like", { pageTitle: user.nickname, user, videoList });
};
