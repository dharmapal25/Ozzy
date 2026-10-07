import fs from "fs"
import path from "path"

let FilesData = [];

function FilesDataReader(Root) {

    const allRootDocsArr = fs.readdirSync(Root);


    for (let i = 0; i < allRootDocsArr.length; i++) {

        const FileLocation = path.join(Root, allRootDocsArr[i]);
        const state = fs.statSync(FileLocation);

        if (state.isFile()) {

            const info = fs.readFileSync(FileLocation, "utf-8");
            const filename = path.basename(FileLocation)
            const filetype = path.extname(filename)
            FilesData.push({
                FileLocation,
                filename,
                filetype,
                info
            });

        }
        else if (state.isDirectory()) {

            FilesDataReader(FileLocation);

        }
    }

    return FilesData
}


// console.log(" >>>>> ",FilesDataReader("D:/EZ-Summarize/MVP-Summarizer/Newfolder"))

export default FilesDataReader