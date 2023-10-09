export const LuaCodeChatTagSystem = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
]]



--// Service //--
local TextChatService = game:GetService('TextChatService')
local ReplicatedStorage = game:GetService('ReplicatedStorage')
local ServerScriptService = game:GetService('ServerScriptService')
----



--// Presetup //--
local FolderAutoSetup = script:FindFirstChild('AutoSetup')
if FolderAutoSetup then
	for _, Service in pairs(FolderAutoSetup:GetChildren()) do

		if Service.Name == 'StarterPlayer' then
			local targetService = game[Service.Name]

			for _, StarterScripts: Folder in pairs(Service:GetChildren()) do
				--warn('[Service] Folder: ' .. tostring(Folder))
				for _, target in pairs(StarterScripts:GetChildren()) do
					local Location = targetService[StarterScripts.Name]
					target.Parent = Location
				end
			end

		else

			local Location = game[Service.Name]
			if not Location then continue end

			for _, target in pairs(Service:GetChildren()) do
				target.Parent = Location
			end

		end
	end
end
----



--// Types //--

----



--// Constants //--
local fChatTagSystem = ReplicatedStorage:WaitForChild('ChatTagSystem', 5)
assert(fChatTagSystem)
local fDevelopers = fChatTagSystem:WaitForChild('Developers', 5)
assert(fDevelopers)
local fDevText = fChatTagSystem:WaitForChild('DevText', 5)
assert(fDevText)
----



--// Remotes //--

----



--// Modules //--

----



--// Variables //--
local playerAdded = {}
----



--// Functions //--
local function OnPlayerAdded(player: Player)
	playerAdded[player] = true

	if not fDevelopers:FindFirstChild(player.Name) then return end


	local fLocalizationSystem = player:WaitForChild('LocalizationSystem', 5)
	local vLocaleID: StringValue = fLocalizationSystem:WaitForChild('LocaleID', 5)
	local LocaleID = (vLocaleID and vLocaleID.Value) and vLocaleID.Value or 'en-us'
	local fPlayerChatTag = fDevelopers[player.Name]
	local color = fPlayerChatTag.Color.Value
	local role = fPlayerChatTag.Role[LocaleID].Value
	local dev = fDevText[LocaleID].Value
	local Tags = {
		{
			['TagText'] = ('%s %s'):format(dev, role),
			['TagColor'] = color
		}
	}
	local Script_ChatServiceRunner = ServerScriptService:WaitForChild('ChatServiceRunner', 5)
	if Script_ChatServiceRunner then
		local OldTextChatService = require(Script_ChatServiceRunner.ChatService)
		local Speaker
		while not Speaker do
			task.wait()
			Speaker = OldTextChatService:GetSpeaker(player.Name)
			if Speaker then break end
		end
		Speaker:SetExtraData('Tags', Tags)
		Speaker:SetExtraData('ChatColor', color)
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
if TextChatService.ChatVersion == Enum.ChatVersion.LegacyChatService then
	local LocalScript_ChatTagClient = game.StarterPlayer.StarterPlayerScripts:WaitForChild('ChatTagClient', 5)
	if not LocalScript_ChatTagClient then return end

	LocalScript_ChatTagClient:Destroy()
	LocalScript_ChatTagClient = nil
end
----



--// Main //
game.Players.PlayerAdded:Connect(OnPlayerAdded)
game.Players.PlayerRemoving:Connect(OnPlayerRemoving)
CheckPlayerAdded()
----`