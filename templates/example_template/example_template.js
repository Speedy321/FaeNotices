function configure(jsonConfig){
    document.querySelector("#content p").textContent = jsonConfig["text"];
    document.documentElement.style.setProperty("--text-bg-color", jsonConfig["bg-color"]);
}