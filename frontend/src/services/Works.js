import API from "./api";


// api/work/upload-files
export const sendWorkConversation = async (information, message, workId) => {

    const { data } = await API.post("/work/upload-files", {
        information, message, workId
    });

    return data;
}


// api/work/receive-file/:workId
export const loadWorkConversationById = async (workId) => {
    const { data } = await API.get(`/work/receive-file/${workId}`);
    
    return data;
}


// api/work/receive-all-files
export const loadAllWorkConversations = async () => {
    const { data } = await API.get("/work/receive-all-files");
    return data;
}




