import { createContext, useContext, useEffect, useState } from 'react';

export const SyncContext = createContext({
    savedQuestions: [],
    unit: "all",
});

export const SyncProvider = ({ children }) => {
    const [savedQuestions, setSavedQuestions] = useState([]);
    const [unit, setUnit] = useState("all");
    const displayUnit = unit === "all" ? null : unit === "1/2" ? "Units 1 & 2" : `Unit ${unit}`;

    useEffect(() => {
        try {
            const localSavedQuestions = JSON.parse(localStorage.getItem("savedQuestions") || "{}");
            const localUnit = localStorage.getItem("unit") || "all";
            setSavedQuestions(localSavedQuestions);
            setUnit(localUnit);
        } catch (e) {
            console.log("Error loading saved questions or unit from localStorage", e);
        }
    }, []);

    return (
        <SyncContext.Provider value={{ savedQuestions, setSavedQuestions: (data) => {
            setSavedQuestions(data);
            localStorage.setItem("savedQuestions", JSON.stringify(data));
        }, unit, setUnit: (data) => {
            setUnit(data);
            localStorage.setItem("unit", data);
        }, displayUnit }}>
            {children}
        </SyncContext.Provider>
    );
}

export const useSync = () => {
    const context = useContext(SyncContext);
    if (!context) {
        throw new Error('useSync must be used within a SyncProvider');
    }
    return context;
}