import readline from "readline";

function askYesNo(query: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve =>
    rl.question(query + " (y/n)", ans => {
      rl.close();
      if (ans === "y") resolve(true);
      resolve(false);
    })
  );
}

export default askYesNo;
