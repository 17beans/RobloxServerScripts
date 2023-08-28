export const LuaCodeBlockDamage = `


-- Script by bean7189



-- 이 스크립트는 캐릭터에게 데미지를 주는 스크립트 입니다.
-- Workspace 내에 존재하는 모든 파트들 중 이름을 "Damage"로 하면 기본 10의 데미지가, "Damage-25"로 하면 25의 데미지, "Damage-100"으로 하면 캐릭터를 죽일 수 있습니다.



--// Functions //--

-- 데미지 블록에 닿았을 때 호출되는 함수.
local function OnDamageBlockTouch(coll: BasePart, nameTable: {})
    local character: Model = coll.Parent
    if not character then return end
    local Humanoid = character:FindFirstChildOfClass('Humanoid')
    if not Humanoid then return end
    if not (Humanoid.Health > 0) then return end

    -- 기본 데미지 10
    local amount = 10
    if nameTable[3] and tonumber(nameTable[3]) then amount = tonumber(nameTable[3]) end

    -- 데미지 주기
    Humanoid:TakeDamage(amount)
    -- 데미지 쿨타임
    task.wait(0.25)
end

-- Workspace 내에 있는 모든 Part를 찾아 이름에 Damage가 있을 경우 데미지를 줄 수 있도록 작성된 함수.
local function InitializeDamageBlocks()
    for _, block: BasePart in pairs(workspace:GetDescendants()) do
        if not block:IsA('BasePart') then continue end
        if not string.find(block.Name, 'Damage') then continue end
        local nameTable = string.split(block.Name, '-')

        local debounce = false
        block.Touched:Connect(function(coll)
            if debounce then return end

            debounce = true
            -- 데미지 부여하는 함수
            OnDamageBlockTouch(coll, nameTable)
            debounce = false
        end)
    end
end

----



--// Main //--
-- Workspace 내 모든 데미지 블록에 기능 부여
InitializeDamageBlocks()
----`