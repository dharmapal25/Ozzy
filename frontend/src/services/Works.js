import API from "./api";


// api/work/upload-files
export const sendWorkConversation = async (files, message, workId) => {
    const formData = new FormData();
    formData.append("message", message);
    if (workId) formData.append("workId", workId);

    formData.append("paths", JSON.stringify(files.map((file) => file.relativePath || file.webkitRelativePath || file.name)));
    files.forEach((file) => formData.append("files", file, file.name));

    const { data } = await API.post("/work/upload-files", formData);

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


