import React, { useContext, useState } from 'react'
import { loadAllWorkConversations, loadWorkConversationById, sendWorkConversation } from '../services/Works';
import { useNavigate, useParams } from 'react-router-dom';


export const workContext = useContext();

export const WorkProvider = ({ children }) => {

    const navigate = useNavigate();
    const { workId } = useParams();

    const [error, setError] = useState(null)
    const [load, setLoad] = useState(false)
    const [Works, setWorks] = useState([]);
    const [curWork, setCurWork] = useState(null)



    const handleError = (err) => {
        if (err.response) {
            setError(err.response.data.message || "Server error");
        } else if (err.request) {
            setError("Server is not responding");
        } else {
            setError(err.message || "Something went wrong");
        }
    };


    const sendWorkConversationData = async () => {

        if (!message.trim()) return;

        try {
            setLoad(true);
            const { data } = await sendWorkConversation(information, message, workId);
            setCurWork(data)




        } catch (err) {
            handleError(err)
        } finally {
            setLoad(false)
        }

    }

    const WorkConversationIdData = async (workId) => {

        try {
            setLoad(true);
            const response = await loadWorkConversationById(workId);
            setCurWork(response)
        } catch (err) {
            handleError(err)
        }

    }

    const LoadWorkAllConversationData = async () => {

        try {
            setLoad(true);
            const response = await loadAllWorkConversations();
            setWorks(response)
        } catch (err) {
            handleError(err)
        }

    }



    return (
        <workContext.Provider
            value={{
                sendWorkConversationData,
                WorkConversationIdData,
                LoadWorkAllConversationData,
                setCurWork,
                curWork,
                setWorks,
                Works,
                load,
                error
            }} >

            {children}

        </workContext.Provider>
    )


}

export const useConversation = () => useContext(workContext)