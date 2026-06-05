import { io } from "socket.io-client";
import { API_URL } from "../core/appData";

const socket = io(`${API_URL}`, {
    autoConnect: false
});

export default socket