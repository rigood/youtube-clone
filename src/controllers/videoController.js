import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" }).populate("author");
  return res.render("home", { pageTitle: "홈", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("author")
    .populate({
      path: "comments",
      populate: {
        path: "author",
      },
    });
  const asideVideos = await Video.find({}).sort({ createdAt: "desc" }).populate("author");
  if (!video) {
    return res.render("404", { pageTitle: "해당 동영상이 존재하지 않습니다." });
  }
  return res.render("watch", { pageTitle: video.title, video, asideVideos });
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];

  if (!keyword) {
    req.flash("error", "검색어를 입력해주세요.");
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

export const hashtag = async (req, res) => {
  const { hashtag } = req.params;

  let videos = [];

  if (!hashtag) {
    return res.redirect("/");
  }

  if (hashtag) {
    videos = await Video.find({
      hashtags: {
        $regex: new RegExp(hashtag, "i"),
      },
    }).populate("author");
  }

  return res.render("home", { pageTitle: "홈", videos });
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
    req.flash("error", "동영상 수정 권한이 없습니다.");
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
    files: { thumb },
  } = req;

  const thumbSize = thumb[0].size;

  if (thumbSize > 5000000) {
    return res.status(500).render("upload", { pageTitle, errorMsg: "5MB 이하 썸네일 이미지만 업로드 할 수 있습니다." });
  }

  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "해당 동영상이 존재하지 않습니다." });
  }

  if (String(video.author) !== String(_id)) {
    req.flash("error", "동영상 수정 권한이 없습니다.");
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
    thumbUrl: thumb[0].path,
  });

  req.flash("success", "동영상이 수정되었습니다.");
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
  const comments = video.comments;
  const user = await User.findById(_id);

  if (!video) {
    return res.render("404", { pageTitle: "해당 동영상이 존재하지 않습니다." });
  }

  if (String(video.author) !== String(_id)) {
    req.flash("error", "동영상 삭제 권한이 없습니다.");
    return res.status(403).redirect("/");
  }

  // 비디오 삭제
  await Video.findByIdAndDelete(id);

  // 코멘트 삭제
  await Comment.deleteMany({
    _id: { $in: comments },
  });

  // user 안에 있는 비디오, 코멘트 삭제
  user.videos.splice(user.videos.indexOf(id), 1);
  comments.map((comment) => {
    user.comments.splice(user.comments.indexOf(comment), 1);
  });
  user.save();

  req.flash("success", "동영상이 삭제되었습니다.");
  return res.redirect("/");
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "동영상 업로드" });
};

const isHeroku = process.env.NODE_ENV === "production";

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

  if (videoSize > 30000000) {
    return res.status(500).render("upload", { pageTitle, errorMsg: "30MB 이하 동영상 파일만 업로드 할 수 있습니다." });
  }

  if (thumbSize > 5000000) {
    return res.status(500).render("upload", { pageTitle, errorMsg: "5MB 이하 썸네일 이미지만 업로드 할 수 있습니다." });
  }

  try {
    const newVideo = await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : thumb[0].path,
      author: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    req.flash("success", "동영상이 업로드 되었습니다.");
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

export const createComment = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);
  const user = await User.findById(_id);

  if (!video) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    author: _id,
    video: id,
  });

  video.comments.push(comment._id);
  await video.save();

  user.comments.push(comment._id);
  await user.save();

  return res.status(201).json({
    newCommentId: comment._id,
    authorId: user._id,
    authorAvatarUrl: user.avatarUrl,
    authorNickname: user.nickname,
    createdAt: new Date().toLocaleDateString(),
  });
};

export const deleteComment = async (req, res) => {
  const {
    params: { videoId, commentId },
    session: {
      user: { _id },
    },
  } = req;

  const video = await Video.findById(videoId);
  const comment = await Comment.findById(commentId);
  const user = await User.findById(_id);

  if (!video) {
    return res.sendStatus(404);
  }

  if (!comment) {
    return res.sendStatus(404);
  }

  if (!user) {
    return res.sendStatus(404);
  }

  if (String(comment.author) !== String(_id)) {
    req.flash("error", "댓글 삭제 권한이 없습니다.");
    return res.status(403).redirect("/");
  }

  console.log(`💚 비디오 ${videoId}, 코멘트 ${commentId}, 유저 ${_id}`);

  // 코멘트 삭제
  await Comment.findByIdAndDelete(commentId);

  // 비디오 모델에서 코멘트 삭제
  video.comments.splice(video.comments.indexOf(commentId), 1);
  await video.save();

  // 유저 모델에서 코멘트 삭제
  user.comments.splice(user.comments.indexOf(commentId), 1);
  await user.save();

  return res.sendStatus(200);
};
