const timerFunc = (baseTime) => {
  const elapsedInMs = Date.now() - baseTime;

  const minsDisplay = Math.floor(elapsedInMs / 60000);
  const secsDisplay = Math.floor((elapsedInMs % 60000) / 1000);

  console.log(`${minsDisplay} : ${secsDisplay}`);
};

const base = new Date().getSeconds();

console.log(base);
