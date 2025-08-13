import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  documents: new Map(),
  reports: new Map(),
  isLoading: false,
  error: null,
  currentDocument: null,
  currentReport: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
      
    case 'CLEAR_ERROR':
      return { ...state, error: null };
      
    case 'ADD_DOCUMENT':
      const newDocuments = new Map(state.documents);
      newDocuments.set(action.payload.id, action.payload);
      return { 
        ...state, 
        documents: newDocuments,
        currentDocument: action.payload
      };
      
    case 'UPDATE_DOCUMENT':
      const updatedDocuments = new Map(state.documents);
      updatedDocuments.set(action.payload.id, action.payload);
      return { 
        ...state, 
        documents: updatedDocuments,
        currentDocument: action.payload
      };
      
    case 'SET_CURRENT_DOCUMENT':
      return { ...state, currentDocument: action.payload };
      
    case 'ADD_REPORT':
      const newReports = new Map(state.reports);
      newReports.set(action.payload.id, action.payload);
      return { 
        ...state, 
        reports: newReports,
        currentReport: action.payload
      };
      
    case 'UPDATE_REPORT':
      const updatedReports = new Map(state.reports);
      updatedReports.set(action.payload.id, action.payload);
      return { 
        ...state, 
        reports: updatedReports,
        currentReport: action.payload
      };
      
    case 'SET_CURRENT_REPORT':
      return { ...state, currentReport: action.payload };
      
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    ...state,
    dispatch
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
