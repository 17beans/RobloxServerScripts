export const LuaCodeDataStoreSystem = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
]]



--// Service //--
local ReplicatedStorage = game:GetService('ReplicatedStorage')
local DataStoreService = game:GetService('DataStoreService')
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
local Config = script.Config
local fPlayerDataStructure = Config.PlayerDataStructure
local StructureName = 'PlayerData'

local DataStores = {
	['RewardTools'] = DataStoreService:GetDataStore('RewardedTools')
}

local fDataStoreSystemReplicated = ReplicatedStorage.DataStoreSystem
----



--// Remotes / Bindables //--
local BFncGetDataStoreData: BindableFunction = fDataStoreSystemReplicated.GetDataStoreData
local BFncSetDataStoreData: BindableFunction = fDataStoreSystemReplicated.SetDataStoreData
----



--// Modules //--

----



--// Variables //--
local playerAdded = {}
----



--// Functions //--
local function GetDataStoreData(player: Player, DataStore: DataStore)
	local count = 1
	local maxAttemptCount = 5
	local data

	local s, r
	repeat
		s, r = pcall(function()
			data = DataStore:GetAsync(player.UserId)

			count += 1
		end)
	until s or count >= maxAttemptCount
	if not s then warn('GetDataStoreData error: ', r) end

	return data
end

local function SetDataStoreData(player: Player, DataStore: DataStore, data)
	local count = 1
	local maxAttemptCount = 5

	local s, r
	repeat
		s, r = pcall(function()
			data = DataStore:GetAsync(player.UserId)

			count += 1
		end)
	until s or count >= maxAttemptCount
	if not s then warn('SetDataStoreData error: ', r) end

	return true
end


local function GetRewardedToolsData(player: Player)
	return GetDataStoreData(player, DataStores['RewardTools'])
end

local function SetRewardedToolsData(player: Player, bool: boolean)
	local response = SetDataStoreData(player, DataStores['RewardTools'], bool)
	if response then return response end
	if not response then return false end
end


local function SetupDataValues(player: Player)
	local fPlayerData = fPlayerDataStructure:Clone()
	fPlayerData.Parent = player
	fPlayerData.Name = StructureName
end


local function OnPlayerAdded(player: Player)
	playerAdded[player] = true

	SetupDataValues(player)
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
BFncGetDataStoreData.OnInvoke = GetDataStoreData
BFncSetDataStoreData.OnInvoke = SetDataStoreData
----`