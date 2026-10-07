import FilesDataReader from "../services/file.service.js";
import chunksOfInfomation from "../utils/chucks.js";

const testFiles = async (req, res) => {
    const { information } = req.body;

    try {

        // information

        let filesInfo = FilesDataReader(information);

        // console.log(filesInfo)

        const info = await chunksOfInfomation(filesInfo);

        res.json({
            // data: info
            data: filesInfo
        })


    } catch (err) {
        console.log("Error : ", err)
    }
}


export { testFiles };