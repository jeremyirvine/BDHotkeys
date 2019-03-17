//META { "name": "HotKeys" } *//

const remote = require("electron").remote
let disc_electron = remote.require("electron")
let prompt = remote.dialog
let prefix = "srttv_ff_hv_"
let fs = require("fs")
let path = require("path")

class HotKeys {
    getName() {return "Discord Server HotKeys";}
    getDescription() {return "Allows assigning keybinds to specific servers";}
    getVersion() {return "0.0.2";}
    getAuthor() {return "Jeremy Irvine (@jezza.sh)";}

    load() {
        this.loadConfig()
    }

    loadConfig() {
        if(fs.existsSync(path.join(__dirname, "Hotkeys.config.json"))) {
            this.settings = JSON.parse(fs.readFileSync(path.join(__dirname, "Hotkeys.config.json")))
            console.log("Found")
            console.log(this.settings)
        } else {
            fs.writeFileSync(path.join(__dirname, "Hotkeys.config.json"), "[]")
        }

        if(this.settings == undefined) {
            this.settings = {
                keybinds: []
            }
        }
    }

    constructor() {
        
    }

    start() {
        this.loadConfig()
        this.loadKeybinds()
    } 
    stop() {
        this.loadConfig()
        this.unloadKeybinds()
    }

    getSettingsPanel() {
        const panel = $('<form>').addClass('form').css('width', '100%');
        this.generatePanel(panel);
        return panel[0];
    }

    reloadKeybinds() {
        $(".settings-open").children()[0].click()
        $(".settings-closed").each(se => {
            console.log(se)
            console.log($($(".settings-closed")[se].children[0].children[0].children[0]).html())
            if($($(".settings-closed")[se].children[0].children[0].children[0]).html() == "Discord Server HotKeys") {
                $($(".settings-closed")[se].children[2].children[1]).click()
            }
        })

        
        
    }

    generatePanel(panel) {
        panel.append(
            $("<button>", {
                type: 'button',
                text: 'Add Keybind',
                id: prefix + "add_keybind",
                style: "margin-right: 5px"
            }).on("click", () => {
                this.settings.keybinds.push({
                    key: $("#" + prefix + "keybind_val").val(),
                    server: $("#" + prefix + "server_val").val()
                })
                $("#" + prefix + "keybind_val").val("")
                $("#" + prefix + "server_val").val("")
                console.log(this.settings)
                
                this.loadKeybinds()
                this.saveSettings()
                this.reloadKeybinds()
            }) 
        )
        panel.append(
            $("<input>", {
                type: "text",
                placeholder: "Keybind (e.g. 'Ctrl+M', 'Command+H')",
                style: "width: 233px",
                id: prefix + "keybind_val"
            })
        )
        panel.append(
            $("<input>", {
                type: "text",
                placeholder: "Server Name (Case Sensitive)",
                style: "width: 233px; margin-right: 5px;",
                id: prefix + "server_val"
            })
        )
        panel.append("<br><br><ul id='"+prefix+"keybind_list'>")
        
        this.settings.keybinds.forEach(key => {
            panel.append(
                $("<button>", {
                    type: "button",
                    text: "Remove",
                    style:"background-color: red !important"
                }).on("click", () => {
                    var index = this.settings.keybinds.indexOf(key)
                    this.settings.keybinds.splice(index, 1)
                    this.loadKeybinds()
                    this.saveSettings()
                    this.reloadKeybinds()
                })
            )
            
            panel.append(key.key + ": " + key.server + "</li><br><br>")
        })

        panel.append("</ul>")
    }

    loadKeybinds() {
        this.settings.keybinds.forEach(key => {
            disc_electron.globalShortcut.register(key.key, () => {
            let mod_discord__servers = document.getElementsByClassName("container-2td-dC")
            
            for (var server in document.getElementsByClassName("container-2td-dC")) {
                let name = mod_discord__servers[server].children[0].children[0].children[0].getAttribute("aria-label")
                if(name == key.server) {
                    mod_discord__servers[server].children[0].children[0].children[0].click()
                }
                
            }
        })
        })
    }

    unloadKeybinds() {
        this.settings.keybinds.forEach(key => {
            disc_electron.globalShortcut.unregister(key.key)
        })
    }

    saveSettings() {
        // PluginUtilities.saveSettings(this.getName(), this.settings)
        fs.writeFileSync(path.join(__dirname, "Hotkeys.config.json"), JSON.stringify(this.settings))
    }

    observer(changes) {}
}