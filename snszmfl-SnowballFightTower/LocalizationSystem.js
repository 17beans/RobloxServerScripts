export const LuaCodeLocalizationSystem = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
]]



--// Service //--

----



--// Presetup //--

----



--// Types //--

----



--// Constants //--

----



--// Remotes / Bindables //--

----



--// Modules //--

----



--// Variables //--
local playerAdded = {}
----



--// Functions //--
local function OnPlayerAdded(player: Player)
	playerAdded[player] = true

	local vLocaleID = Instance.new('StringValue')
	vLocaleID.Parent = player
	vLocaleID.Name = 'LocaleID'
	local s, e = pcall(function()
		vLocaleID.Value = player.LocaleId
	end)
	if not s then
		warn('Localization error: Failed to create LocaleID')
	end
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
----



--// Setup //--

----



--// Main //
game.Players.PlayerAdded:Connect(OnPlayerAdded)
game.Players.PlayerRemoving:Connect(OnPlayerRemoving)
CheckPlayerAdded()
----`