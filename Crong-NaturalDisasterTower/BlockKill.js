export const LuaCodeBlockKill = `


-- Script by bean7189



--// Functions //--

-- 킬 블록에 닿았을 때 호출되는 함수.
local function OnKillBlockTouch(coll: BasePart)
    local character: Model = coll.Parent
    if not character then return end
    local Humanoid = character:FindFirstChildOfClass('Humanoid')
    if not Humanoid then return end
    if not (Humanoid.Health > 0) then return end

    -- 데미지 주기
    Humanoid:TakeDamage(100.1)
    -- 쿨타임
    task.wait(0.25)
end

-- Workspace 내에 있는 모든 Part를 찾아 이름에 Kill이 있을 경우 데미지를 줄 수 있도록 작성된 함수.
local function InitializeKillBlocks()
    for _, block: BasePart in pairs(workspace:GetDescendants()) do
        if not block:IsA('BasePart') then continue end
        if not string.find(block.Name, 'Kill') then continue end

        local debounce = false
        block.Touched:Connect(function(coll)
            if debounce then return end

            debounce = true
            -- 데미지 부여하는 함수
            OnKillBlockTouch(coll)
            debounce = false
        end)
    end
end

----



--// Main //--
-- Workspace 내 모든 킬 블록에 기능 부여
InitializeKillBlocks()
----`