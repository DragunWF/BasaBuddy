import { useReducer, createContext } from "react";

const ACTION_TYPE = {
  ADD: "ADD",
  SET: "SET",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  CLEAR: "CLEAR",
};

// For auto-completion and documentation purposes
export const ChatContext = createContext({
  chatHistory: [],
  addChat: (data) => {},
  setChat: (data) => {},
  updateChat: (id, updatedData) => {},
  deleteChat: (id) => {},
  clearChat: () => {},
});

function ChatContextProvider({ children }) {
  const [chatState, dispatch] = useReducer(dataReducer, []);

  function addChat(data) {
    dispatch({ type: ACTION_TYPE.ADD, payload: data });
  }

  function setChat(data) {
    dispatch({ type: ACTION_TYPE.SET, payload: data });
  }

  function updateChat(id, data) {
    dispatch({ type: ACTION_TYPE.UPDATE, payload: { id, data } });
  }

  function deleteChat(id) {
    dispatch({ type: ACTION_TYPE.DELETE, payload: { id } });
  }

  function clearChat() {
    dispatch({ type: ACTION_TYPE.CLEAR });
  }

  const value = {
    data: dataState,
    addChat,
    setChat,
    updateChat,
    deleteChat,
    clearChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

function dataReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPE.ADD:
      return [action.payload, ...state];
    case ACTION_TYPE.SET:
      return action.payload;
    case ACTION_TYPE.UPDATE:
      const targetIndex = state.findIndex(
        (item) => item.id === action.payload.id
      );
      if (targetIndex === -1) {
        return state;
      }

      const targetItem = state[targetIndex];
      const updatedItem = { ...targetItem, ...action.payload.data };
      const updatedData = [...state];
      updatedData[targetIndex] = updatedItem;
      return updatedData;
    case ACTION_TYPE.DELETE:
      return state.filter((data) => data.id !== action.payload.id);
    case ACTION_TYPE.CLEAR:
      return [];
    default:
      return state;
  }
}

export default ChatContextProvider;
