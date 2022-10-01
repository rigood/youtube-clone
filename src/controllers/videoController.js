import User from "../models/User";
import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" }).populate("author");
  return res.render("home", { pageTitle: "홈", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("author");
  if (!video) {
    return res.render("404", { pageTitle: "해당 동영상이 존재하지 않습니다." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];

  if (!keyword) {
    // [todo] flash 검색어를 입력해주세요.
    return res.redirect("/");
  }

  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("author");
  }

  return res.render("search", { pageTitle: "검색 결과", videos, keyword });
};

export const getEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "해당 동영상이 존재하지 않습니다." });
  }

  if (String(video.author) !== String(_id)) {
    // [todo] flash 동영상 수정 권한이 없습니다.
    return res.status(403).redirect("/");
  }

  return res.render("edit", { pageTitle: video.title, video });
};

export const postEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
    body: { title, description, hashtags },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "해당 동영상이 존재하지 않습니다." });
  }

  if (String(video.author) !== String(_id)) {
    // [todo] flash 동영상 수정 권한이 없습니다.
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  // [todo] flash 동영상이 수정되었습니다.
  return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "해당 동영상이 존재하지 않습니다." });
  }

  if (String(video.author) !== String(_id)) {
    // [todo] flash 동영상 삭제 권한이 없습니다.
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndDelete(id);
  // [todo] flash 동영상이 삭제되었습니다.
  return res.redirect("/");
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "동영상 업로드" });
};

export const postUpload = async (req, res) => {
  const pageTitle = "동영상 업로드";
  const {
    session: {
      user: { _id },
    },
    files: { video, thumb },
    body: { title, description, hashtags },
  } = req;

  const videoSize = video[0].size;
  const thumbSize = thumb[0].size;

  if (videoSize > 10000000) {
    return res.status(500).render("upload", { pageTitle, errorMsg: "10MB 이하 동영상 파일만 업로드 할 수 있습니다." });
  }

  if (thumbSize > 5000000) {
    return res.status(500).render("upload", { pageTitle, errorMsg: "5MB 이하 썸네일 이미지만 업로드 할 수 있습니다." });
  }

  try {
    const newVideo = await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      author: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    // [todo] flash 동영상이 업로드 되었습니다.
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle,
      errorMsg: "동영상 업로드 중 오류가 발생했습니다.",
    });
  }
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }

  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};
