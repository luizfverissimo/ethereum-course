const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildFolderPath = path.resolve(__dirname, "build");

if(fs.existsSync(buildFolderPath)){
    fs.removeSync(buildFolderPath);
}

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildFolderPath);
for(let contract in output){
    fs.outputJsonSync(
        path.resolve(buildFolderPath, contract.replace(":", "") + ".json"),
        output[contract]
    );
}

console.log("✅ Compiled contracts successfully!");