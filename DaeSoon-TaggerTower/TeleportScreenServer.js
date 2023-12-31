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
local function SetupTeleportParts()
	for _, Departure: Part in fTeleportParts:GetChildren() do
		if Departure.Name ~= 'Departure' then continue end
		if not Departure:IsA('BasePart') then continue end
		local vDestination: ObjectValue = Departure:FindFirstChild('Destination')
		if not vDestination then continue end
		local partDestination: BasePart = vDestination.Value
		if not partDestination then return end


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
	end
end


local function CheckAndRepairTeleportScreenGui(player: Player)

	repeat task.wait() until player
	local PlayerGui = player:FindFirstChildOfClass('PlayerGui')
	repeat
		task.wait()
		PlayerGui = player:FindFirstChildOfClass('PlayerGui')
	until PlayerGui

	local sgPlayerTeleportScreen = PlayerGui:WaitForChild('PlayerTeleportScreen', 5)
	if not sgPlayerTeleportScreen then
		local Cloned_sgPlayerTeleportScreen: ScreenGui = sgPlayerTeleportScreen:Clone()
		Cloned_sgPlayerTeleportScreen.Parent = PlayerGui
	end

end
----



--// Setup //--

----



--// Main //--
SetupTeleportParts()

local playerAdded = {}
local function OnPlayerAdded(player: Player)
	playerAdded[player] = true

	CheckAndRepairTeleportScreenGui()
end

local function CheckPlayerAdded()
	for _, player in pairs(game.Players:GetPlayers()) do
		if playerAdded[player] then continue end
		OnPlayerAdded(player)
	end
end

local function OnPlayerRemoving(player: Player)
	playerAdded[player] = nil
end
game.Players.PlayerAdded:Connect(OnPlayerAdded)
game.Players.PlayerRemoving:Connect(OnPlayerRemoving)
CheckPlayerAdded()
----`