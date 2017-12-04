-- Other Libs
require "libs/gooi"
ripple = require 'libs/ripple'
Camera = require 'libs/Camera'
-- Asix Libs
state = require "libs/stateMana"
audio = require "libs/audioMana"
work = require "libs/workMana"
virus = require "libs/virusMana"
ui = require "libs/uiMana"

function alert()
    gooi.alert({
        text = "Welcome to Work Masters\nClick to Start Game!",
        ok = function()
            state.set(WORK_STATE)
        end
    })
end

function love.load()
    audio.load()
    ui.load()
    work.newWork()

    alert()
end

function love.update(dt)
    audio.update(dt)
    ui.update(dt)
    if state.get() == WORK_STATE or state.get() == PROCESS_STATE then
        work.update(dt)
        virus.update(dt)
    end
end

function love.draw()
    ui.draw()
    if state.get() == WORK_STATE or state.get() == PROCESS_STATE then
        work.draw()
    end
end

function love.mousepressed(x, y, button)     gooi.pressed() end
function love.mousereleased(x, y, button)    gooi.released() end

function love.keypressed(key)
    if key == 's' then
        if state.get() == WORK_STATE then
            state.set(PROCESS_STATE)
            print("In Process State")
        else
            state.set(WORK_STATE)
            print("In Work State")
        end

        ui.updateMap()
    end

    if state.get() == WORK_STATE then
        work.sendKeys(key)
    elseif state.get() == PROCESS_STATE then
        virus.sendKeys(key)
    end
end