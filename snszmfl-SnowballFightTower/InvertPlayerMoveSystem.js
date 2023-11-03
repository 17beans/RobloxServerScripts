export const LuaCodeInvertPlayerMoveSystem = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
]]



--// Service //--
local StarterPlayer = game:GetService('StarterPlayer')
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


local newPlayerModule = script.PlayerModule
function SetupPlayerModule()
	local PlayerModule: ModuleScript = StarterPlayer.StarterPlayerScripts:FindFirstChild('PlayerModule')
	if PlayerModule then
		PlayerModule:Destroy()
		PlayerModule = nil
	end

	PlayerModule = newPlayerModule:Clone()
	PlayerModule.Parent = StarterPlayer.StarterPlayerScripts
end
SetupPlayerModule()
----



--// Types //--

----



--// Constants //--

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

	local fInvertPlayerMoveSystem = Instance.new('Folder')
	fInvertPlayerMoveSystem.Parent = player
	fInvertPlayerMoveSystem.Name = 'InvertPlayerMoveSystem'
	local vInvertMoveInput = Instance.new('BoolValue')
	vInvertMoveInput.Parent = fInvertPlayerMoveSystem
	vInvertMoveInput.Name = 'InvertMoveInput'
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