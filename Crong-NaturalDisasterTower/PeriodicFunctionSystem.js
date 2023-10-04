export const LuaCodePeriodicFunctinSystem = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.


[완료] 지진 - 파트 흔들리게
[완료] 대설 - 모든 파트가 미끄러워짐
[완료] 눈보라 - 움직이지 않으면 체력 깎임
[완료] 모래바람 - 앞이 안보이게
[완료] 바이러스 - 랜덤으로 감염되고 감염된 사람과 접촉하면 체력 깎임
[완료] 산성비 - 비를 맞으면 체력 깎임
[완료] 우박 - 하늘에서 우박이 떨어지고 맞으면 체력 깎임
토네이도 - 토네이도에 닿으면 날라감
번개 - 맞으면 즉사

]]



--// Services //--
local Players = game:GetService('Players')
local ReplicatedStorage = game:GetService('ReplicatedStorage')
local Debris = game:GetService('Debris')
----



--// Presetup //--
local FolderAutoSetup = script:FindFirstChild('AutoSetup')
if FolderAutoSetup then
	for _, Service in pairs(FolderAutoSetup:GetChildren()) do

		if Service.Name == 'StarterPlayer' then
			local targetService = game[Service.Name]

			for _, StarterScripts: Folder in pairs(Service:GetChildren()) do
				--print('[Service] Folder: ' .. tostring(Folder))
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
local fPeriodicFunctionSystemReplicated = ReplicatedStorage.PeriodicFunctionSystem
local fPeriodicFunctions = script.PeriodicFunctions
local LocalizationSystemReplicated = ReplicatedStorage:WaitForChild('LocalizationSystem', 5)

local config = fPeriodicFunctionSystemReplicated.Config

local PERIODIC_FUNCTION_INTERVAL_MIN = config.PeriodicFunctionIntervalMin.Value
local PERIODIC_FUNCTION_INTERVAL_MAX = config.PeriodicFunctionIntervalMax.Value
local PERIODIC_FUNCTION_ALERT_TIME = config.PeriodicFunctionAlertTime.Value

local fShelters = workspace.PeriodicFunctionSystem.Shelters

----



--// Remotes / Bindables //--
local REvtAlertPeriodicFunction = ReplicatedStorage.PeriodicFunctionSystem.Remotes.AlertPeriodicFunction
local REvtShowPictogram = ReplicatedStorage.PeriodicFunctionSystem.Remotes.ShowPictogram
local BEvtPausePeriodicFunction = ReplicatedStorage.PeriodicFunctionSystem.Bindables.PausePeriodicFunction
local BEvtResumePeriodicFunction = ReplicatedStorage.PeriodicFunctionSystem.Bindables.ResumePeriodicFunction
----



--// Modules //--
local Localization = require(LocalizationSystemReplicated:WaitForChild('Localization', 5))
local Common = require(script.Common)
----



--// Variables //--
local PeriodicFunctionRunning = false
local playerAddedPassed = {}

local periodicFunctionFolders = {}
local periodicFunctionModules = {}
local coroutines = {}
local currentModule: { ['Execute']: ()->(), ['Cancel']: ()->() }
----



--// Functions //--
local function InitializePeriodicFunctions()
	----// Setup PeriodicFunction Folders and Modules which is Activated //----
	for _, fPeriodicFunction: Folder in pairs(fPeriodicFunctions:GetChildren()) do
		local config = fPeriodicFunction.Config
		local vIsActive: BoolValue = config.Active
		if not vIsActive.Value then continue end

		table.insert(periodicFunctionFolders, fPeriodicFunction)
		periodicFunctionModules[fPeriodicFunction.Name] = require(fPeriodicFunction[fPeriodicFunction.Name])
	end
	--------


	if #periodicFunctionFolders == 0 then error('There is no Periodic Functions are Active') end
end


local function ServicePeriodicFunction()
	while true do
		task.wait()


		local currentInterval = math.random(PERIODIC_FUNCTION_INTERVAL_MIN, PERIODIC_FUNCTION_INTERVAL_MAX)
		local random: Folder = math.random(1, #periodicFunctionFolders)
		local currentPeriodicFunctionFolder: Folder = periodicFunctionFolders[random]
		local config = currentPeriodicFunctionFolder.Config

		--print('currentPeriodicFunctionName: ', currentPeriodicFunctionFolder.Name)
		task.wait(currentInterval)

		-- Alert Periodic Function
		REvtShowPictogram:FireAllClients(config.Icon.Image)
		local TimeLeft = PERIODIC_FUNCTION_ALERT_TIME
		while TimeLeft >= 0 do
			local PeriodicFunctionInfo: { Title: {string}, Description: {string}, FunctionName: {string} }
				= Localization.PeriodicFunctionsInfo[currentPeriodicFunctionFolder.Name]
			local Title: {string} = PeriodicFunctionInfo.Title
			local Description: {string} = PeriodicFunctionInfo.Description
			local FunctionName: {string} = PeriodicFunctionInfo.FunctionName
			local isDanger: boolean = config.IsDanger.Value
			REvtAlertPeriodicFunction:FireAllClients(Title, Description, FunctionName, TimeLeft, isDanger)
			--print('TimeLeft: ', TimeLeft)
			task.wait(1)
			TimeLeft -= 1
		end


		-- Execute Periodic Function
		currentModule = periodicFunctionModules[currentPeriodicFunctionFolder.Name]
		currentModule.Execute()
	end
end


local function RunServicePeriodicFunctionService()
	coroutines['ServicePeriodicFunction'] = coroutine.create(ServicePeriodicFunction)
	coroutine.resume(coroutines.ServicePeriodicFunction)
	PeriodicFunctionRunning = true
end


local function StopServicePeriodicFunctionService()
	if currentModule and currentModule.Cancel then
		currentModule.Cancel()
		currentModule = nil
	end

	Common.AlertAllClient(Common.MessageType.Hint, Localization.AlertInfo.Stop.HintMessage)

	coroutine.close(coroutines.ServicePeriodicFunction)
end


local function OnBindablePausePeriodicFunction()
	if not PeriodicFunctionRunning then return end


	StopServicePeriodicFunctionService()
	PeriodicFunctionRunning = false

	local Title = Localization.AlertInfo.Stop.Title
	local Description = Localization.AlertInfo.Stop.Description
	local FunctionName = Localization.AlertInfo.Stop.FunctionName
	local TimeLeft = 0
	local isDanger = false
	REvtAlertPeriodicFunction:FireAllClients(Title, Description, FunctionName, TimeLeft, isDanger)
end

local function OnBindableResumePeriodicFunction()
	if PeriodicFunctionRunning then return end


	RunServicePeriodicFunctionService()
	PeriodicFunctionRunning = true
end


local function InitializeSafeZones()
	for _, Shelter: BasePart in fShelters:GetChildren() do

		local TouchedDebounce = false
		Shelter.Touched:Connect(function(coll: BasePart)
			if TouchedDebounce then return end
			local character = coll.Parent
			if not character then return end
			local player = Players:GetPlayerFromCharacter(character)
			if not player then return end
			local Humanoid = character:FindFirstChildOfClass('Humanoid')
			if not Humanoid then return end
			if not (Humanoid.Health > 0) then return end
			local vInShelter: BoolValue = player:FindFirstChild('InShelter')
			if vInShelter.Value then return end


			TouchedDebounce = true
			vInShelter.Value = true
			TouchedDebounce = false
		end)

		local TouchEndedDebounce = false
		Shelter.TouchEnded:Connect(function(coll: BasePart)
			if TouchEndedDebounce then return end
			local character = coll.Parent
			if not character then return end
			local player = Players:GetPlayerFromCharacter(character)
			if not player then return end
			local Humanoid = character:FindFirstChildOfClass('Humanoid')
			if not Humanoid then return end
			if not (Humanoid.Health > 0) then return end
			local vInShelter: BoolValue = player:FindFirstChild('InShelter')
			if not vInShelter.Value then return end


			TouchEndedDebounce = true
			vInShelter.Value = false
			TouchEndedDebounce = false
		end)
	end

end


local function OnPlayerAdded(player: Player)

	table.insert(playerAddedPassed, player)
	
	local vInShelter = Instance.new('BoolValue')
	vInShelter.Parent = player
	vInShelter.Name = 'InShelter'
	vInShelter:GetPropertyChangedSignal('Value'):Connect(function()
		pcall(function()
			if vInShelter.Value then
				local Found = player.Character:FindFirstChildOfClass('ForceField')
				if Found then return end
				local ForceField = Instance.new('ForceField')
				ForceField.Parent = player.Character

			else

				local Found: ForceField = player.Character:FindFirstChildOfClass('ForceField')
				if not Found then return end
				Found:Destroy()
				Found = nil
			end
		end)
	end)

	local vNoDamage = Instance.new('BoolValue')
	vNoDamage.Parent = player
	vNoDamage.Name = 'NoDamage'
	vNoDamage:GetPropertyChangedSignal('Value'):Connect(function()
		pcall(function()
			if vNoDamage.Value then
				local Found = player.Character:FindFirstChildOfClass('ForceField')
				if Found then return end
				local ForceField = Instance.new('ForceField')
				ForceField.Parent = player.Character

			else

				local Found: ForceField = player.Character:FindFirstChildOfClass('ForceField')
				if not Found then return end
				Found:Destroy()
				Found = nil
			end
		end)
	end)



	-- Show Developer
	local function ShowDeveloper(player: Player)
		player.CharacterAppearanceLoaded:Wait()

		local function CreateBillboard(player: Player, role: {})
			local message = {
				['ko-kr'] = '%s 개발자 @%s',
				['en-us'] = '%s Developer @%s',
			}

			local billboard = Instance.new('BillboardGui')
			billboard.Parent =  player.Character.Head
			billboard.Size = UDim2.new(0, 100, 0, 50)
			billboard.StudsOffset = Vector3.new(0, 3, 0)
			local Frame = Instance.new('Frame')
			Frame.Parent = billboard
			Frame.Size = UDim2.new(1, 0, 1, 0)
			Frame.AnchorPoint = Vector2.new(0.5, 0.5)
			Frame.Position = UDim2.new(0.5, 0, 0.5, 0)
			Frame.BackgroundTransparency = 1
			local TextLabel = Instance.new('TextLabel')
			TextLabel.Parent = Frame
			TextLabel.Size = UDim2.new(1, -10, 1, -10)
			TextLabel.BackgroundTransparency = 1
			TextLabel.Position = UDim2.new(0.5, 0, 0.5, 0)
			TextLabel.AnchorPoint = Vector2.new(0.5, 0.5)
			TextLabel.TextScaled = true
			TextLabel.TextColor3 = Color3.fromRGB(0, 255, 0)
			TextLabel.Text = string.format(message['en-us'], role['en-us'], player.Name)
			local UIStroke = Instance.new('UIStroke')
			UIStroke.Parent = TextLabel
			UIStroke.Thickness = 2
			UIStroke.Color = Color3.fromRGB(255, 255, 255)
		end

		local messages = {
			['ko-kr'] = '[System] %s 개발자 %s님이 입장하셨습니다',
			['en-us'] = '[System] %s Developer %s join the game',
		}
		local developers = {
			['bean7189'] = {
				['role'] = {
					['ko-kr'] = '스크립터',
					['en-us'] = 'Scripter',
				}
			},
			['Hyunyi01_26good'] = {
				['role'] = {
					['ko-kr'] = '빌더',
					['en-us'] = 'Builder',
				}
			},
			['C_rongg'] = {
				['role'] = {
					['ko-kr'] = '기획자',
					['en-us'] = 'GamePlanner',
				}
			},
		}

		if player.Name == 'bean7189' then
			for _, otherPlayer: Player in game.Players:GetPlayers() do
				local LocaleID = otherPlayer.LocaleId == 'ko-kr' and 'ko-kr' or 'en-us'

				local Hint = Instance.new('Hint')
				Hint.Parent = otherPlayer.PlayerGui
				Hint.Text = string.format(messages[LocaleID], developers[player.Name].role[LocaleID], player.Name)
				game.Debris:AddItem(Hint, 5)
			end
			CreateBillboard(player, developers[player.Name].role)

		elseif player.Name == 'Hyunyi01_26good' then
			for _, otherPlayer: Player in game.Players:GetPlayers() do
				local LocaleID = otherPlayer.LocaleId == 'ko-kr' and 'ko-kr' or 'en-us'

				local Hint = Instance.new('Hint')
				Hint.Parent = otherPlayer.PlayerGui
				Hint.Text = string.format(messages[LocaleID], developers[player.Name].role[LocaleID], player.Name)
				game.Debris:AddItem(Hint, 5)
			end
			CreateBillboard(player, developers[player.Name].role)

		elseif player.Name == 'C_rongg' then
			for _, otherPlayer: Player in game.Players:GetPlayers() do
				local LocaleID = otherPlayer.LocaleId == 'ko-kr' and 'ko-kr' or 'en-us'

				local Hint = Instance.new('Hint')
				Hint.Parent = otherPlayer.PlayerGui
				Hint.Text = string.format(messages[LocaleID], developers[player.Name].role[LocaleID], player.Name)
				game.Debris:AddItem(Hint, 5)
			end
			CreateBillboard(player, developers[player.Name].role)

		end
	end
	ShowDeveloper(player)

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


local function OnPlayerRemoving(player: Player)
	local Found = table.find(playerAddedPassed, player)
	if Found then
		table.remove(playerAddedPassed, Found)
	end
end
----



--// Setup //--
InitializePeriodicFunctions()
InitializeSafeZones()
----



--// Main //
Players.PlayerAdded:Connect(OnPlayerAdded)
Players.PlayerRemoving:Connect(OnPlayerRemoving)
RunServicePeriodicFunctionService()
BEvtPausePeriodicFunction.Event:Connect(OnBindablePausePeriodicFunction)
BEvtResumePeriodicFunction.Event:Connect(OnBindableResumePeriodicFunction)
CheckPlayerAddedPassedPlayer()
----`