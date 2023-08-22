export const LuaCodePeriodicFunctinSystem = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.


[완료] 지진 - 파트 흔들리게
[완료] 대설 - 모든 파트가 미끄러워짐
[완료] 눈보라 - 움직이지 않으면 체력 깎임
[완료] 모래바람 - 앞이 안보이게
바이러스 - 랜덤으로 감염되고 감염된 사람과 접촉하면 체력 깎임
산성비 - 비를 맞으면 체력 깎임
우박 - 하늘에서 우박이 떨어지고 맞으면 체력 깎임
번개 - 맞으면 즉사
토네이도 - 토네이도에 닿으면 날라감

]]



--// Services //--
local Players = game:GetService('Players')
local ReplicatedStorage = game:GetService('ReplicatedStorage')
local ServerStorage = game:GetService('ServerStorage')
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
local fPeriodicFunctionSystemStorage = ServerStorage.PeriodicFunctionSystem
local fPeriodicFunctions = fPeriodicFunctionSystemStorage.PeriodicFunctions
local LocalizationSystemReplicated = ReplicatedStorage:WaitForChild('LocalizationSystem', 5)

local config = fPeriodicFunctionSystemReplicated.Config

local PERIODIC_FUNCTION_INTERVAL_MIN = config.PeriodicFunctionIntervalMin.Value
local PERIODIC_FUNCTION_INTERVAL_MAX = config.PeriodicFunctionIntervalMax.Value
local PERIODIC_FUNCTION_ALERT_TIME = config.PeriodicFunctionAlertTime.Value
----



--// Remotes / Bindables //--
local REvtAlertPeriodicFunction = ReplicatedStorage.PeriodicFunctionSystem.Remotes.AlertPeriodicFunction
local BEvtPausePeriodicFunction = ReplicatedStorage.PeriodicFunctionSystem.Bindables.PausePeriodicFunction
local BEvtResumePeriodicFunction = ReplicatedStorage.PeriodicFunctionSystem.Bindables.ResumePeriodicFunction
----



--// Modules //--
local Localization = require(LocalizationSystemReplicated:WaitForChild('Localization', 5))
local Common = require(script.Common)
----



--// Variables //--
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
		--task.wait(currentInterval)
		task.wait(6)

		-- Alert Periodic Function
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
	StopServicePeriodicFunctionService()

	local Title = Localization.AlertInfo.Stop.Title
	local Description = Localization.AlertInfo.Stop.Description
	local FunctionName = Localization.AlertInfo.Stop.FunctionName
	local TimeLeft = 0
	local isDanger = false
	REvtAlertPeriodicFunction:FireAllClients(Title, Description, FunctionName, TimeLeft, isDanger)
end

local function OnBindableResumePeriodicFunction()
	RunServicePeriodicFunctionService()
end
----



--// Setup //--
InitializePeriodicFunctions()
----



--// Main //
RunServicePeriodicFunctionService()
BEvtPausePeriodicFunction.Event:Connect(OnBindablePausePeriodicFunction)
BEvtResumePeriodicFunction.Event:Connect(OnBindableResumePeriodicFunction)
----`