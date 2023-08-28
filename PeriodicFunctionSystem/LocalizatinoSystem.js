export const LuaCodeLocalizationSystem = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
]]



--// Service //--
local ReplicatedStorage = game:GetService('ReplicatedStorage')
local RunService = game:GetService('RunService')
local Players = game:GetService('Players')
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
type TypeLocaleID = {
	['ko-kr']: string,
	['en-us']: string,
}

local LocaleIDs = {
	['ko-kr'] = 'ko-kr',
	['en-us'] = 'en-us',
}
----



--// Constants //--
local fLocalizationSystemReplicated = ReplicatedStorage.LocalizationSystem

local config = script.Config

local DefaultLocaleID = LocaleIDs["ko-kr"]

local IsStudio = RunService:IsStudio()
----



--// Remotes //--
local REvtSendLocaleID = fLocalizationSystemReplicated.SendLocaleID

----



--// Modules //--

----



--// Variables //--
local playerAddedPassed = {}
local SupportLocaleIDs = {}
----



--// Functions //--
local function OnPlayerAdded(player: Player)
	table.insert(playerAddedPassed, player)
	
	local fLocalizationSystem = Instance.new('Folder')
	fLocalizationSystem.Parent = player
	fLocalizationSystem.Name = 'LocalizationSystem'
end

-- PlayerAdded 이벤트가 발생하기 전 이미 접속 완료된 플레이어가 존재할 경우에 대한 예외 처리 함수
local function CheckPlayerAddedPassedPlayer()
	for _, player in Players:GetPlayers() do
		local passed = table.find(playerAddedPassed, player)
		if passed then continue end

		table.insert(playerAddedPassed, player)
		OnPlayerAdded(player)
	end
end


local function OnReceiveLocaleIDFromClient(player: Player, LocaleID: TypeLocaleID)
	print('OnReceiveLocaleIDFromClient function was called. LocaleID: ', LocaleID)
	local fLocalizationSystem: Folder = player.LocalizationSystem

	local vLocaleID = Instance.new('StringValue')
	vLocaleID.Parent = fLocalizationSystem
	vLocaleID.Name = 'LocaleID'

	if not table.find(SupportLocaleIDs, LocaleID) then
		print('[Server] Player LocaleID is not support: ' .. tostring(LocaleID))
	end


	if IsStudio then
		--print('[Server] 기본 LocaleID로 설정합니다: ', tostring(DefaultLocaleID))
		vLocaleID.Value = DefaultLocaleID
	else
		vLocaleID.Value = 
			table.find(SupportLocaleIDs, LocaleID) and LocaleID or DefaultLocaleID
	end
end
----



--// Setup //--
for _, LocaleID: BoolValue in pairs(config.SupportLocaleIDs:GetChildren()) do
	table.insert(SupportLocaleIDs, LocaleID.Name)
end
----



--// Main //
REvtSendLocaleID.OnServerEvent:Connect(OnReceiveLocaleIDFromClient)
Players.PlayerAdded:Connect(OnPlayerAdded)
CheckPlayerAddedPassedPlayer()
----`