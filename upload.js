const express = require('express');
const router = express.Router()
const path = require('path');
const multer = require("multer");
const sharp = require("sharp");
const fs = require('fs');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname); // 파일 확장자
    const timestamp= new Date().getTime().valueOf(); // 현재 시간
    // 새 파일명(기존 파일명 + 시간 + 확장자)
    const filename = path.basename(file.originalname, ext) + timestamp + ext;
    cb(null, filename)
  }
});

const upload = multer({ storage, storage });
// console.log('나 업로드야', upload)
// cb: callback (error, filename)


router.post("/", upload.single("selecImg"), (req, res) => {
  try {
    sharp(req.file.path) // 압축할 이미지 경로
      .resize({ width: 600 }) // 비율유지 가로 600로 줄이기
      .withMetadata() // 이미지의 exif 데이터 유지
      .toBuffer((err, buffer) => {
        if (err) throw err;
        // 압축된 파일 새로 저장(덮어씌우기)
        fs.writeFile(req.file.path, buffer, (err) => {
          if (err) throw err;
        });
      });
  } catch (err) {
    console.error(err)
  }
  res.json({ filename: `${req.file.filename}`})
});

module.exports = router

// 27. withMetadata를 해주는 이유 exif 데이터는 이미지 방향정보이다.
//     이게 없어지게 되면 이미지방향이 이상하곳으로 갈 수있다.

// req.file upload middleware 즉 multer를 거친후에만 존재하는 객체이다.