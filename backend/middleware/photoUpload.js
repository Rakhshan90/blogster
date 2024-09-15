const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');

//storage
const multerStorage = multer.memoryStorage();

//file type checking
const multerFilter = (req, file, cb)=>{
    //check file type
    if(file.mimetype.startsWith("image")){
        //continue asynchronous operation of multer middleware 
        //cb -> callback
        cb(null, true);
    }
    else{
        //rejected
        //cb -> callback
        cb({message: "unsupported file format"}, false);
    }
};

const photoUpload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fileSize: 1000000}
})


//Profile photo resizing
const profilePhotoResize = async (req, res, next) => {
    //check if there is no file exist
    if (!req.file) return next();
  
    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
  
    try {
      const image = await Jimp.read(req.file.buffer);
      const resizedImage = await image
        .resize(250, 250) // resize
        .quality(90) // set JPEG quality
        .writeAsync(path.join(`public/images/profiles/${req.file.filename}`));
      next();
    } catch (error) {
      console.error("Error resizing image:", error);
      // Handle the error appropriately, potentially sending an error response
    }
  };
  
  //post image resizing
  const postImgResize = async (req, res, next) => {
    //check if there is no file exist
    if (!req.file) return next();
  
    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
  
    try {
      const image = await Jimp.read(req.file.buffer);
      const resizedImage = await image
        .resize(500, 500) // resize
        .quality(90) // set JPEG quality
        .writeAsync(path.join(`public/images/posts/${req.file.filename}`));
      next();
    } catch (error) {
      console.error("Error resizing image:", error);
      // Handle the error appropriately, potentially sending an error response
    }
  };

module.exports = {photoUpload, profilePhotoResize, postImgResize };