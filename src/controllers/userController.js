import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "회원가입" });

export const postJoin = async (req, res) => {
  const { email, password, password2, nickname } = req.body;
  const pageTitle = "회원가입";

  if (password !== password2) {
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

export const logout = (req, res) => res.send("logout");

export const getEdit = (req, res) => res.send("getEdit");
export const postEdit = (req, res) => res.send("postEdit");

export const getChangePw = (req, res) => res.send("getChangePw");
export const postChangePw = (req, res) => res.send("postChangePw");

export const startGithubLogin = (req, res) => res.send("startGithubLogin");
export const finishGithubLogin = (req, res) => res.send("finishGithubLogin");

export const see = (req, res) => res.send("see");
