const hre = require("hardhat");

async function main() {

  const News = await hre.ethers.getContractFactory("News");
  const news = await News.deploy("News Blog","BLOGS","100000000000000");

  await news.deployed();

  console.log("News deployed to:", news.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
