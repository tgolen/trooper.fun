import fs from "fs";
import moment from "moment";

import siteData from "../data/site.json" assert { type: "json" };

const pathToImagesToAdd = "./data/images_to_add";

function findNewImage() {
  const images = fs.readdirSync(pathToImagesToAdd);
  for (const image of images) {
    const imagePath = `${pathToImagesToAdd}/${image}`;
    return imagePath;
  }
  return null;
}

function addNewImageToSiteData(imagePath) {
  console.log(`Adding new image: ${imagePath}`);
  const createdOn = moment();
  const fileNameArray = imagePath.split("/");
  const fileNameWithoutExtension =
    fileNameArray[fileNameArray.length - 1].split(".")[0];
  const newPost = {
    title: `${createdOn.format("LL")} - ${fileNameWithoutExtension}`,
    url: `${createdOn.format("YYYY-MM-DD")}_${fileNameWithoutExtension}.html`,
    description: "",
    pathToImage: `/photos/${fileNameArray[fileNameArray.length - 1]}`,
  };
  siteData.posts.push(newPost);
}

function writeSiteData() {
  console.log("Writing site data to file");
  const data = JSON.stringify(siteData, null, 4);
  fs.writeFileSync("./data/site.json", data);
}

function deleteNewlyAddedImage(imagePath) {
  console.log(`Deleting newly added image: ${imagePath}`);
  fs.unlinkSync(imagePath);
}

function run() {
  const imagePath = findNewImage();
  if (!imagePath) {
    console.log("No new images found to add");
    return;
  }

  addNewImageToSiteData(imagePath);
  writeSiteData();
  deleteNewlyAddedImage(imagePath);
}

run();
