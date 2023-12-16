export const LuaCodeCharacterRandomDraw = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외의 사람이
 분석, 참고, 이용하는 등 유출 행위를 금합니다.
 Copyright 2023. bean7189 All rights reserved.
]]



--// Services //--
local Players = game:GetService('Players')
local ReplicatedStorage = game:GetService('ReplicatedStorage')
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
local fBean7189CharacterRandomDraw = ReplicatedStorage['bean7189-CharacterRandomDraw']
local fBindables = fBean7189CharacterRandomDraw['Bindables']
local fRemotes = fBean7189CharacterRandomDraw['Remotes']
local Config = fBean7189CharacterRandomDraw['Config']
----



--// Remotes / Bindables //--
local BFncCharacterRandomDraw: BindableFunction = fBindables.CharacterRandomDraw
local REvtCharacterRandomDraw: RemoteEvent = fRemotes.CharacterRandomDraw
----



--// Modules //--

----



--// Variables //--
local isPlaying = false
----



--// Functions //--
local function GetPlayerList()
	return Players:GetPlayers()
end


local function SelectRandomCharacter(players: {})
	return players[math.random(1, #players)]
end


local function GameStart()
	if isPlaying then return end

	isPlaying = true
	local list = GetPlayerList()
	local selectedPlayer = SelectRandomCharacter(list)
	-- 시작 신호 보내기
	REvtCharacterRandomDraw:FireAllClients(list, selectedPlayer)

	-- 일정 시간 대기 후 뽑기 가능한 상태로 전환
	task.spawn(function()
		task.wait(10)
		isPlaying = false
	end)


	return selectedPlayer
end
----



--// Setup //--

----



--// Main //--
BFncCharacterRandomDraw.OnInvoke = function(): Player
	if isPlaying then return end
	return GameStart()
end
----`