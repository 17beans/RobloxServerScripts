export const LuaCodeTeleportScreenServer = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외의 사람이
 분석, 참고, 이용하는 등 유출 행위를 금합니다.
 Copyright 2023. bean7189 All rights reserved.
]]



--// Services //--
local Players = game:GetService('Players')
local StarterGui = game:GetService('StarterGui')
local TweenService = game:GetService('TweenService')
local ReplicatedStorage = game:GetService('ReplicatedStorage')
----



--// Presetup //--
local sgTeleportScreen = script:WaitForChild('TeleportScreen', 5)
sgTeleportScreen.Parent = StarterGui
----



--// Types //--

----



--// Constants //--
local fTeleportParts = workspace:WaitForChild('TeleportParts', 5)
assert(fTeleportParts, '오류: Workspace에 TeleportParts 폴더가 없습니다.')
local fBlackScreen = sgTeleportScreen['화면 가리게']

local tweenFadeIn = TweenService:Create(
	fBlackScreen,
	TweenInfo.new(1, Enum.EasingStyle.Linear, Enum.EasingDirection.In),
	{ BackgroundTransparency = 0 }
)

local tweenFadeOut = TweenService:Create(
	fBlackScreen,
	TweenInfo.new(1, Enum.EasingStyle.Linear, Enum.EasingDirection.Out),
	{ BackgroundTransparency = 1 }
)
----



--// Remotes / Bindables //--
local BEvtTeleportScreenOn = script.TeleportScreenOn
BEvtTeleportScreenOn.Parent = ReplicatedStorage
----



--// Modules //--

----



--// Variables //--

----



--// Functions //--

----



--// Setup //--

----



--// Main //--
for _, Departure: Part in fTeleportParts:GetChildren() do
	if Departure.Name ~= 'Departure' then continue end
	if not Departure:IsA('BasePart') then continue end
	local vDestination: ObjectValue = Departure:FindFirstChild('Destination')
	if not vDestination then continue end
	local partDestination: BasePart = vDestination.Value
	if not partDestination then return end

	;(function()
		local touchedDebounce = false
		Departure.Touched:Connect(function(coll)
			local character : Model= coll.Parent
			if not character then return end
			local player = Players:GetPlayerFromCharacter(character)
			if not player then return end
			local Humanoid = character:FindFirstChildOfClass('Humanoid')
			if not Humanoid then return end
			if not (Humanoid.Health > 0) then return end
			local HRP: Part = character:FindFirstChild('HumanoidRootPart')
			if not HRP then return end


			touchedDebounce = true
			BEvtTeleportScreenOn:Fire(player, partDestination)
			touchedDebounce = false
		end)
	end)()
end
----`