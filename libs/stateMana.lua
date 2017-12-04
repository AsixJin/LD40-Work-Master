-- List of States
START_STATE = "start"
WORK_STATE = "work"
PROCESS_STATE = "process"
OVER_STATE = "lose"

local state = START_STATE

local function getState()
    return state
end

local function setState(s)
    state = s
end

local function youLose()
    state = OVER_STATE
    gooi.alert({
        text = "You Lose!\nTry Again!",
        ok = function()
            love.event.quit("restart")
        end
    })
end

local function youWin()
    state = OVER_STATE
    gooi.alert({
        text = "You Win!\nGood Job!",
        ok = function()
            love.event.quit("restart")
        end
    })
end

return{
    get = getState,
    set = setState,
    lose = youLose,
    win = youWin
}
