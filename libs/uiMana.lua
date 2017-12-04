-- Camera

-- Work Bar
local workBar
local workValue = work.getLeft()/work.getMax()

-- Process Bar
local virusBar

--
local map_workSprite = love.graphics.newImage("maps/office_work.png")
local map_processSprite = love.graphics.newImage("maps/office_process.png")
local mapSprite = map_workSprite
local panelSprite = love.graphics.newImage("graphics/msgBox.png")

local function load()
    cam = Camera(160.5, 160.5, 320, 320)
    gooi.desktopMode()

    workBar = gooi.newBarPlus({
        value = work.getPrecent(),
        x = 47,
        y = 335,
        w = 250,
        h = 25
    })
    workBar:bg("393939")
    workBar:fg("0000CD")

    virusBar = gooi.newBarPlus({
        value = virus.precent(),
        x = 47,
        y = 375,
        w = 250,
        h = 25
    })
    virusBar:bg("393939")
end

local function update(dt)
    cam:update(dt)
    gooi.update(dt)
end

local function draw()
    love.graphics.draw(mapSprite, 0, 0)
    love.graphics.draw(panelSprite, 0, 320)

    -- if state.get() == WORK_STATE or state.get() == PROCESS_STATE then
        gooi.draw()
    -- end

    cam:attach()
    cam:detach()
    cam:draw()
end

local function changeMap()
    if state.get() == WORK_STATE then
        mapSprite = map_workSprite
    elseif state.get() == PROCESS_STATE then
        mapSprite = map_processSprite
    end
end

local function changeWorkValue(value)
    print("This is the value " ..value)
    workBar:changeValue(value)
    print("Bar Value: " ..workBar:getValue())
    print("Work Precent: " ..work.getPrecent())
end

local function changeVirusValue(value)
    virusBar:changeValue(value)

    if value < 0.50 then
        virusBar:fg("00A86B")
    elseif value < 0.75 then
        virusBar:fg("FFFF00")
    else
        virusBar:fg("B22222")
    end
end

return{
    load = load,
    update = update,
    draw = draw,
    updateWork = changeWorkValue,
    updateVirus = changeVirusValue,
    updateMap = changeMap
}