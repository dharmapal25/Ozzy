import React, { createContext, useCallback, useContext, useState } from 'react'
import { loadAllWorkConversations, loadWorkConversationById, sendWorkConversation } from '../services/Works';
import { useParams } from 'react-router-dom';


export const workContext = createContext(null);

export const WorkProvider = ({ children }) => {

    const { workId } = useParams();

    const [error, setError] = useState(null)
    const [load, setLoad] = useState(false)
    const [Works, setWorks] = useState([]);
    const [curWork, setCurWork] = useState(null)



    const handleError = useCallback((err) => {
        if (err.response) {
            setError(err.response.data.message || "Server error");
        } else if (err.request) {
            setError("Server is not responding");
        } else {
            setError(err.message || "Something went wrong");
        }
    }, []);

    const sendWorkConversationData = useCallback(async (information, message, conversationId = workId) => {
        if (typeof message !== "string" || !message.trim()) return null;

        try {
            setError(null);
            setLoad(true);
            const response = await sendWorkConversation(information, message, conversationId);
            return response;
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setLoad(false);
        }
    }, [handleError, workId]);

    const WorkConversationIdData = useCallback(async (id = workId) => {
        try {
            setError(null);
            setLoad(true);
            const response = await loadWorkConversationById(id);
            const conversation = response.message;
            setCurWork(conversation);
            return conversation;
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setLoad(false);
        }
    }, [handleError, workId]);

    const LoadWorkAllConversationData = useCallback(async () => {
        try {
            setError(null);
            setLoad(true);
            const response = await loadAllWorkConversations();
            setWorks(response.allWorksChat || []);
            return response.allWorksChat || [];
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setLoad(false);
        }
    }, [handleError]);



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

export const useConversation = () => {
    const context = useContext(workContext);

    if (!context) {
        throw new Error('useConversation must be used within a WorkProvider');
    }

    return context;
};