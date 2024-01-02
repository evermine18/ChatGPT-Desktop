import Folders from "./folders/folders"
import KeyboardRedo from "./keyboard-redo/redo";
import API from "./requests";

async function init() {
    const response = await API.GET('https://chat.openai.com/api/auth/session');
    localStorage.setItem("accessToken", response.accessToken);
}
init();

const experimentalFeatures = localStorage.getItem("experimentalFeatures");
if (experimentalFeatures && experimentalFeatures === "true") {
    const folders = new Folders();
}
const keyboardRedo = new KeyboardRedo();