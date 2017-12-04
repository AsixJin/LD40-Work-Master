local workLeft = 50
local workMax = 50

local workTable = {}
local completeTable = {false, false, false}
local workPos = 1

local correct_hand = love.graphics.newImage("graphics/correct.png")
local up_hand = love.graphics.newImage("graphics/up.png")
local right_hand = love.graphics.newImage("graphics/right.png")
local down_hand = love.graphics.newImage("graphics/down.png")
local left_hand = love.graphics.newImage("graphics/left.png")

local function getWork()
    workTable = {}
    table.insert(workTable, love.math.random(1, 4))
    print(workTable[1])
    table.insert(workTable, love.math.random(1, 4))
    print(workTable[2])
    table.insert(workTable, love.math.random(1, 4))
    print(workTable[3])
    completeTable = {false, false, false }
    workPos = 1
end

local function addWork(value)
    workLeft = workLeft + love.math.random(1, value)
    ui.updateWork(workLeft/workMax)
end

local function checkWorkPos(num)
    virusMutate = false

    if virus.precent() >= 0.75 then
        if love.math.random(1, 2) == 1 then
            num = love.math.random(1, 4)
            virusMutate = true
        end
    elseif virus.precent() >= 0.50 then
        if love.math.random(1, 4) == 1 then
            num = love.math.random(1, 4)
            virusMutate = true
        end
    end

    if workTable[workPos] == num then
        completeTable[workPos] = true
        workPos = workPos + 1
        print("correct")
        audio.snd(2)
    else
        completeTable = {false, false, false }
        workPos = 1
        print("wrong")
        audio.snd(1)
        if virusMutate then
            cam:flash(0.05, {0, 0, 0, 255})
        end
        if workLeft < workMax then
            addWork(2)
            ui.updateWork(workLeft/workMax)
        end
    end

    if completeTable[1] and completeTable[2] and completeTable[3] then
        print("all right, new work coming")
        audio.snd(3)
        workLeft = workLeft - 1
        ui.updateWork(workLeft/workMax)
        getWork()
    end
end

local function keyPressed(key)
    if state.get() == WORK_STATE then
        if key == "up" then
            checkWorkPos(1)
        elseif key == "right" then
            checkWorkPos(2)
        elseif key == "down" then
            checkWorkPos(3)
        elseif key == "left" then
            checkWorkPos(4)
        end
    end
end

local function getWorkMax()
    return workMax
end

local function getWorkLeft()
    return workLeft
end

local function getWorkPrecent()
    return workLeft/workMax
end

local function getHandSprite(num)
    if num == 1 then
        return up_hand
    elseif num == 2 then
        return right_hand
    elseif num == 3 then
        return down_hand
    elseif num == 4 then
        return left_hand
    end
end

local function draw()
    if completeTable[1] then
        love.graphics.draw(correct_hand, 32, 192)
    else
        love.graphics.draw(getHandSprite(workTable[1]), 32, 192)
    end

    if completeTable[2] then
        love.graphics.draw(correct_hand, 64, 192)
    else
        love.graphics.draw(getHandSprite(workTable[2]), 64, 192)
    end

    if completeTable[3] then
        love.graphics.draw(correct_hand, 96, 192)
    else
        love.graphics.draw(getHandSprite(workTable[3]), 96, 192)
    end
end

local function update(dt)
    if workLeft <= 0 then
        state.win()
    end
end

return{
    update = update,
    draw = draw,
    newWork = getWork,
    sendKeys = keyPressed,
    getMax = getWorkMax,
    getLeft = getWorkLeft,
    getPrecent = getWorkPrecent,
    add = addWork
}