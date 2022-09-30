import User from "../models/User";
import bcrypt from "bcrypt";

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
    });
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
  return res.render("edit-profile", { pageTitle: "프로필" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { email, nickname },
  } = req;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      email,
      nickname,
    },
    { new: true }
  );

  req.session.user = updatedUser;
  // [todo] flash 변경되었습니다.
  return res.redirect("/users/edit");
};

export const getChangePw = (req, res) => {
  if (req.session.user.socialOnly === true) {
    // [todo] flash 비밀번호 변경 대상이 아닙니다.
    return res.redirect("/");
  }
  return res.render("change-pw", { pageTitle: "비밀번호 변경" });
};

export const postChangePw = async (req, res) => {
  const {
    session: { user: _id },
    body: { oldPw, password, passwordConfirmation },
  } = req;
  const pageTitle = "비밀번호 변경";

  const user = await User.findById(_id);

  const pwMatch = await bcrypt.compare(oldPw, user.password);
  if (!pwMatch) {
    return res.status(400).render("change-pw", { pageTitle, errorMsg: "기존 비밀번호가 일치하지 않습니다." });
  }

  if (password !== passwordConfirmation) {
    return res.status(400).render("change-pw", { pageTitle, errorMsg: "새 비밀번호가 일치하지 않습니다." });
  }

  if (oldPw === password) {
    return res.status(400).render("change-pw", { pageTitle, errorMsg: "기존 비밀번호와 새 비밀번호가 동일합니다." });
  }

  user.password = password;
  await user.save();
  // [todo] flash 비밀번호가 변경되었습니다.
  req.session.destroy();
  return res.redirect("/login");
};

export const startGithubLogin = (req, res) => res.send("startGithubLogin");
export const finishGithubLogin = (req, res) => res.send("finishGithubLogin");

export const see = (req, res) => res.send("see");
