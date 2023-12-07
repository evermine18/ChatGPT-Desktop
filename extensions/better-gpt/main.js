import Folders from "./folders/folders"
import API from "./requests";

async function init() {
    const response = await API.GET('https://chat.openai.com/api/auth/session');
    localStorage.setItem("accessToken", response.accessToken);
}
init();
const folders = new Folders();