window.onload = function () { 
    if(window.location.href.indexOf("?") > -1) {
        const configStr = window.location.href.substring(window.location.href.indexOf("?") + 1);
        const jsonConfig = JSON.parse(decodeURI(configStr));
    
        console.log(jsonConfig);
    
        document.getElementById("main").style.transform = `scale(${jsonConfig["scale"]})`;
        if(jsonConfig["animation-duration"]){
            document.documentElement.style.setProperty("--animation-duration", `${jsonConfig["animation-duration"]}s`);
        }
        configure(jsonConfig["config"]);
    }
}