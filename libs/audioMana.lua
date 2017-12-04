local music

local wrongSnd
local rightSnd
local workCompleteSnd

local function load()
    music = ripple.newSound("audio/music.wav", {loop=true})
    wrongSnd = ripple.newSound("audio/wrong.wav")
    rightSnd = ripple.newSound("audio/right.wav")
    workCompleteSnd = ripple.newSound("audio/all_right.wav")

    music:play()
end

local function update(dt)
    music:update(dt)
end

local function playSnd(sndValue)
    if sndValue == 1 then
        wrongSnd:play()
    elseif sndValue == 2 then
        rightSnd:play()
    elseif sndValue == 3 then
        workCompleteSnd:play()
    end
end

return{
    load = load,
    update = update,
    snd = playSnd
}