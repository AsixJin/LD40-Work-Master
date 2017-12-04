virusTime = 0
virusMax = 60

workTimer = 0

local function getPrecent()
    return virusTime/virusMax
end

local function update(dt)
    if virusTime < virusMax then
        virusTime = virusTime + dt
    elseif virusTime >= virusMax then
        state.lose()
    end

    if state.get() == PROCESS_STATE then
        workTimer = workTimer + dt
        print(workTimer)
        if workTimer >= 5 then
            work.add(5)
            workTimer = 0
        end
    else
        workTimer = 0
    end

    ui.updateVirus(getPrecent())
end

local function keyPressed(key)
    if state.get() == PROCESS_STATE then
        if key == "a" then
            virusTime = virusTime - love.math.random(0.25, 0.50)
        end
    end
end

return{
    update = update,
    precent = getPrecent,
    sendKeys = keyPressed
}