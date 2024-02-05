export const LuaCodeTowerTaggerSkillSystem = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
 Copyright 2023. bean7189 All rights reserved.
]]



--// Services //--
local Players = game:GetService('Players')
local ReplicatedStorage = game:GetService('ReplicatedStorage')
local Debris = game:GetService('Debris')
local MarketplaceService = game:GetService('MarketplaceService')
local DataStoreService = game:GetService('DataStoreService')
local dsPlayerData = DataStoreService:GetDataStore('PlayerData')
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
type TypeData = {
	['Coin']: number,
	['PurchasedProducts']: {},
	['EquippedSkill']: string
}
----



--// Constants //--
local fTowerTaggerSkillSystemReplicated = ReplicatedStorage.TowerTaggerSkillSystem
local fSkills = script.Skills

local config = fTowerTaggerSkillSystemReplicated.Config

local PERIODIC_FUNCTION_INTERVAL_MIN = config.PeriodicFunctionIntervalMin.Value
local PERIODIC_FUNCTION_INTERVAL_MAX = config.PeriodicFunctionIntervalMax.Value
local PERIODIC_FUNCTION_ALERT_TIME = config.PeriodicFunctionAlertTime.Value

local fShelters = workspace.TowerTaggerSkillSystem.Shelters

local fProducts = fTowerTaggerSkillSystemReplicated.Products

local fDataTemplate = script.DataTemplate

local skillTranslate = {
	['Quake'] = {
		['ko-kr'] = '지진',
		['en-us'] = 'Quake',
	},
	['Ice'] = {
		['ko-kr'] = '얼음',
		['en-us'] = 'Ice',
	},
	['Snow'] = {
		['ko-kr'] = '눈',
		['en-us'] = 'Snow',
	},
	['Fire'] = {
		['ko-kr'] = '불',
		['en-us'] = 'Fire',
	},
}
----



--// Remotes / Bindables //--
local fRemotes = fTowerTaggerSkillSystemReplicated.Remotes
local fBindables = fTowerTaggerSkillSystemReplicated.Bindables

local REvtFireSkill: RemoteEvent = fRemotes.FireSkill
local REvtCoolTime: RemoteEvent = fRemotes.CoolTime
local REvtPurchase: RemoteEvent = fRemotes.Purchase

local BEvtPurchaseFinish: BindableEvent = fBindables.Purchase
----



--// Modules //--
local Common = require(script.Common)
----



--// Variables //--
local PeriodicFunctionRunning = false
local playerAddedPassed = {}
local playerSkillDebounces = {}

local periodicFunctionFolders = {}
local periodicFunctionModules = {}
local coroutines = {}
local currentModule: { ['Execute']: ()->(), ['Cancel']: ()->() }
----



--// Functions //--
--local function InitializePeriodicFunctions()
--	----// Setup PeriodicFunction Folders and Modules which is Activated //----
--	for _, fPeriodicFunction: Folder in pairs(fPeriodicFunctions:GetChildren()) do
--		local config = fPeriodicFunction.Config
--		local vIsActive: BoolValue = config.Active
--		if not vIsActive.Value then continue end

--		table.insert(periodicFunctionFolders, fPeriodicFunction)
--		periodicFunctionModules[fPeriodicFunction.Name] = require(fPeriodicFunction[fPeriodicFunction.Name])
--	end
--	--------


--	if #periodicFunctionFolders == 0 then error('There is no Periodic Functions are Active') end
--end


--local function ServicePeriodicFunction()
--	while true do
--		task.wait()


--		local currentInterval = math.random(PERIODIC_FUNCTION_INTERVAL_MIN, PERIODIC_FUNCTION_INTERVAL_MAX)
--		local random: Folder = math.random(1, #periodicFunctionFolders)
--		local currentPeriodicFunctionFolder: Folder = periodicFunctionFolders[random]
--		local config = currentPeriodicFunctionFolder.Config

--		--print('currentPeriodicFunctionName: ', currentPeriodicFunctionFolder.Name)
--		task.wait(currentInterval)

--		-- Alert Periodic Function
--		--REvtShowPictogram:FireAllClients(config.Icon.Image)
--		local TimeLeft = PERIODIC_FUNCTION_ALERT_TIME
--		while TimeLeft >= 0 do
--			local PeriodicFunctionInfo: { Title: {string}, Description: {string}, FunctionName: {string} }
--				= Localization.PeriodicFunctionsInfo[currentPeriodicFunctionFolder.Name]
--			local Title: {string} = PeriodicFunctionInfo.Title
--			local Description: {string} = PeriodicFunctionInfo.Description
--			local FunctionName: {string} = PeriodicFunctionInfo.FunctionName
--			local isDanger: boolean = config.IsDanger.Value
--			REvtAlertPeriodicFunction:FireAllClients(Title, Description, FunctionName, TimeLeft, isDanger)
--			--print('TimeLeft: ', TimeLeft)
--			task.wait(1)
--			TimeLeft -= 1
--		end


--		-- Execute Periodic Function
--		currentModule = periodicFunctionModules[currentPeriodicFunctionFolder.Name]
--		currentModule.Execute()
--	end
--end


--local function RunServicePeriodicFunctionService()
--	coroutines['ServicePeriodicFunction'] = coroutine.create(ServicePeriodicFunction)
--	coroutine.resume(coroutines.ServicePeriodicFunction)
--	PeriodicFunctionRunning = true
--end


--local function StopServicePeriodicFunctionService()
--	if currentModule and currentModule.Cancel then
--		currentModule.Cancel()
--		currentModule = nil
--	end

--	Common.AlertAllClient(Common.MessageType.Hint, Localization.AlertInfo.Stop.HintMessage)

--	coroutine.close(coroutines.ServicePeriodicFunction)
--end


--local function OnBindablePausePeriodicFunction()
--	if not PeriodicFunctionRunning then return end


--	StopServicePeriodicFunctionService()
--	PeriodicFunctionRunning = false

--	local Title = Localization.AlertInfo.Stop.Title
--	local Description = Localization.AlertInfo.Stop.Description
--	local FunctionName = Localization.AlertInfo.Stop.FunctionName
--	local TimeLeft = 0
--	local isDanger = false
--	REvtAlertPeriodicFunction:FireAllClients(Title, Description, FunctionName, TimeLeft, isDanger)
--end

--local function OnBindableResumePeriodicFunction()
--	if PeriodicFunctionRunning then return end


--	RunServicePeriodicFunctionService()
--	PeriodicFunctionRunning = true
--end


--local function InitializeSafeZones()
--	for _, Shelter: BasePart in fShelters:GetChildren() do

--		local TouchedDebounce = false
--		Shelter.Touched:Connect(function(coll: BasePart)
--			if TouchedDebounce then return end
--			local character = coll.Parent
--			if not character then return end
--			local player = Players:GetPlayerFromCharacter(character)
--			if not player then return end
--			local Humanoid = character:FindFirstChildOfClass('Humanoid')
--			if not Humanoid then return end
--			if not (Humanoid.Health > 0) then return end
--			local vInShelter: BoolValue = player:FindFirstChild('InShelter')
--			if vInShelter.Value then return end


--			TouchedDebounce = true
--			vInShelter.Value = true
--			TouchedDebounce = false
--		end)

--		local TouchEndedDebounce = false
--		Shelter.TouchEnded:Connect(function(coll: BasePart)
--			if TouchEndedDebounce then return end
--			local character = coll.Parent
--			if not character then return end
--			local player = Players:GetPlayerFromCharacter(character)
--			if not player then return end
--			local Humanoid = character:FindFirstChildOfClass('Humanoid')
--			if not Humanoid then return end
--			if not (Humanoid.Health > 0) then return end
--			local vInShelter: BoolValue = player:FindFirstChild('InShelter')
--			if not vInShelter.Value then return end


--			TouchEndedDebounce = true
--			vInShelter.Value = false
--			TouchEndedDebounce = false
--		end)
--	end

--end


local OnQuakeExecute = require(fSkills.Quake.Quake).Execute
local OnIceExecute = require(fSkills.Ice.Ice).Execute
local OnSnowExecute = require(fSkills.Snow.Snow).Execute
local OnFireExecute = require(fSkills.Fire.Fire).Execute


local function SetData(player: Player)
	local count = 5
	local s, r
	repeat
		s, r = pcall(function()
			local fStats = player:WaitForChild('Stats')
			local vCoin: NumberValue = fStats.Coin
			local vEquippedSkill: StringValue = fStats.EquippedSkill
			local fPurchasedProducts: Folder = fStats.PurchasedProducts
			local data: TypeData = {
				['Coin'] = vCoin.Value,
				['EquippedSkill'] = vEquippedSkill.Value,
				['PurchasedProducts'] = {},
			}
			for _, Product: BoolValue in fPurchasedProducts:GetChildren() do
				data.PurchasedProducts[Product.Name] = Product.Value
			end

			dsPlayerData:SetAsync(player.UserId, data)
			task.wait(0.25)
			count -= 1
		end)
	until s or count <= 0
end

local function ResetData(player)
	dsPlayerData:RemoveAsync(player.UserId)
end

local function GetData(player: Player)
	local count = 5
	local s, r
	repeat
		s, r = pcall(function()
			local result: TypeData = dsPlayerData:GetAsync(player.UserId)
			task.wait(0.25)
			count -= 1
			return result
		end)
	until s or count <= 0
	if not s and not r then
		SetData(player)
	end

	return r
end


-- 사용자가 구매한 스킬인지 확인
local function CheckPurchased(player: Player, skillName: {'Quake'|'Ice'|'Snow'|'Fire'})
	local fStats: Folder = player.Stats
	local fPurchasedProducts: Folder = fStats.PurchasedProducts
	local vFound_Skill: BoolValue = fPurchasedProducts[skillName]
	-- 비정상 스킬 아이템 필터
	if not vFound_Skill then return end

	return vFound_Skill.Value
end

local function SetupIsPurchasedOnPlayerAdded(player: Player, data: TypeData, vCoin: NumberValue, vEquippedSkill: StringValue, fPurchasedProducts: Folder)
	vCoin.Value = data.Coin
	if CheckPurchased(player, data.EquippedSkill) then
		vEquippedSkill.Value = data.EquippedSkill
	end
	for _, vProduct: BoolValue in fPurchasedProducts:GetChildren() do
		vProduct.Value =  data.PurchasedProducts[vProduct.Name]
	end
end


local function OnPlayerAdded(player: Player)
	-- ResetData if BoolValue.Value == true
	if script.Config.ResetData.Value then
		ResetData(player)
	end

	table.insert(playerAddedPassed, player)

	-- Verify PlayerGui
	local PlayerGui = player:WaitForChild('PlayerGui', 5)
	local LocaleID = player.LocaleId == 'ko-kr' or 'en-us'
	local kickMessages = {
		['ko-kr'] = '접속이 원활하지 않습니다. 네트워크 상태를 확인해 주세요.',
		['en-us'] = 'The connection is not smooth. Please check the network status.',
	}
	assert(PlayerGui, kickMessages[LocaleID])
	if not PlayerGui then player:Kick(kickMessages[LocaleID]) end
	task.spawn(function()
		task.wait(10)
		for _, v in game.StarterGui:GetChildren() do
			if PlayerGui:FindFirstChild(v.Name) then continue end
			v:Clone().Parent = PlayerGui
		end
	end)


	-- 사용자 데이터 구조 생성
	local fStats = fDataTemplate:Clone()
	fStats.Parent = player
	fStats.Name = 'Stats'
	local vCoin: NumberValue = fStats.Coin
	local vEquippedSkill: StringValue = fStats.EquippedSkill
	local fPurchasedProducts: Folder = fStats.PurchasedProducts


	-- 게임 접속 시 모든 스킬 버튼 비활성화
	local PlayerGui = player:WaitForChild('PlayerGui')
	local gui = PlayerGui:WaitForChild('TaggerTowerSkill', 20)
	assert(gui, 'TaggerTowerSkill GUI가 발견되지 않았습니다.')
	local fRightBar = gui:WaitForChild('RightBar')
	for _, ImageButton: ImageButton in fRightBar:GetChildren() do
		if not ImageButton:IsA('ImageButton') then continue end
		ImageButton.Visible = false
	end


	-- 데이터 불러오기
	local data: TypeData = GetData(player)

	-- 데이터 설정
	if data then
		SetupIsPurchasedOnPlayerAdded(
			player,
			data,
			vCoin,
			vEquippedSkill,
			fPurchasedProducts
		)
	end


	-- 최근 장착한 스킬 불러오기
	local PlayerGui = player:WaitForChild('PlayerGui')
	local gui = PlayerGui:WaitForChild('TaggerTowerSkill')
	local fRightBar = gui:WaitForChild('RightBar')
	for _, ImageButton: ImageButton in fRightBar:GetChildren() do
		if not ImageButton:IsA('ImageButton') then continue end
		if ImageButton.Name == vEquippedSkill.Value then ImageButton.Visible = true break end
	end
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

	SetData(player)
end


local function ExecuteSkill(player: Player, skillName: string, Function: () -> (), coolTime)
	REvtCoolTime:FireClient(player, skillName, coolTime)
	playerSkillDebounces[player][skillName] = coolTime
	task.spawn(function()
		while true do
			task.wait(1)
			playerSkillDebounces[player][skillName] -= 1
			if playerSkillDebounces[player][skillName] <= 0 then playerSkillDebounces[player][skillName] = nil break end
		end
	end)

	Function()
end


local skillFunctions = {
	['Quake'] = function(player, skillName)
		local result = CheckPurchased(player, skillName)
		if not result then return end
		local coolTime = 14
		ExecuteSkill(player, skillName, OnQuakeExecute, coolTime)
	end,
	['Ice'] = function(player, skillName)
		local result = CheckPurchased(player, skillName)
		if not result then return end
		local coolTime = 12
		ExecuteSkill(player, skillName, OnIceExecute, coolTime)
	end,
	['Snow'] = function(player, skillName)
		local result = CheckPurchased(player, skillName)
		if not result then return end
		local coolTime = 9
		ExecuteSkill(player, skillName, OnSnowExecute, coolTime)
	end,
	['Fire'] = function(player, skillName)
		local result = CheckPurchased(player, skillName)
		if not result then return end
		local coolTime = 7
		ExecuteSkill(player, skillName, OnFireExecute, coolTime)
	end,
}
----



--// Setup //--
--InitializePeriodicFunctions()
--InitializeSafeZones()
----



--// Main //--
Players.PlayerAdded:Connect(OnPlayerAdded)
Players.PlayerRemoving:Connect(OnPlayerRemoving)
--RunServicePeriodicFunctionService()
--BEvtPausePeriodicFunction.Event:Connect(OnBindablePausePeriodicFunction)
--BEvtResumePeriodicFunction.Event:Connect(OnBindableResumePeriodicFunction)
CheckPlayerAddedPassedPlayer()


REvtFireSkill.OnServerEvent:Connect(function(player, skillName: string)
	if not playerSkillDebounces[player] then playerSkillDebounces[player] = {} end
	if playerSkillDebounces[player][skillName] then return end
	local fn = skillFunctions[skillName]
	if fn then fn(player, skillName) end
end)


-- 구매 완료 이벤트 처리
for _, v in fProducts:GetChildren() do

	local vPrice = v.Price

	local vCoin: NumberValue = vPrice:FindFirstChild('Coin')
	local vGamePass: NumberValue = vPrice:FindFirstChild('GamePass')
	local vDeveloperProduct: NumberValue = vPrice:FindFirstChild('DeveloperProduct')


	if vCoin then
		-- Bindable Event로 구매 완료됐다는 신호가 오면
		BEvtPurchaseFinish.Event:Connect(function(player: Player, productName: string)
			assert(player)
			assert(productName)

			if v.Name ~= productName then return end

			local fStats: Folder = player.Stats
			local fPurchasedProducts: Folder = fStats.PurchasedProducts
			local Found_vProduct: BoolValue = fPurchasedProducts[productName]
			assert(Found_vProduct, ('ReplicatedStorage의 시스템 폴더 내의 Products에 생성되지 않은 상품입니다. (%s)'):format(v.Name))
			Found_vProduct.Value = true

			task.spawn(function()
				task.wait(1)
				SetData(player)
			end)


			--local ImageButton: ImageButton = fRightBar[v.Name]
			--assert(ImageButton, '버튼이 생성되지 않아 사용할 수 없는 스킬입니다.')

			--ImageButton.Visible = true
		end)

	elseif vGamePass then
		-- GamePass 구매 완료됐다는 신호가 오면
		MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player: Player, gamePassID, isPurchased)
			if not isPurchased then return end
			if gamePassID == vGamePass.Value then
				local fStats: Folder = player.Stats
				local fPurchasedProducts: Folder = fStats.PurchasedProducts
				local productName = vGamePass.Parent.Parent.Name
				local Found_vProduct: BoolValue = fPurchasedProducts[productName]
				assert(Found_vProduct, ('ReplicatedStorage의 시스템 폴더 내의 Products에 생성되지 않은 상품입니다. (%s)'):format(v.Name))
				Found_vProduct.Value = true


				--local ImageButton: ImageButton = fRightBar[v.Name]
				--assert(ImageButton, ('버튼이 생성되지 않아 사용할 수 없는 스킬입니다. (%s)'):format(v.Name))

				--ImageButton.Visible = true
			end
		end)

		--elseif vDeveloperProduct then

	end
end


-- Client: 구매할게요!
local PurchaseFinishedMessages = {
	[0] = {
		['ko-kr'] = '구매 되었어요!',
		['en-us'] = 'Purchased!',
	},
	[1] = {
		['ko-kr'] = '구매에 실패했어요 ㅠ 코인을 확인해주세요!',
		['en-us'] = 'Purchase failed. Please check the coin amount!',
	},
	[2] = {
		['ko-kr'] = '%s 스킬을 장착했어요!',
		['en-us'] = '%s skill is equipped!',
	},
}
local playerPurchaseDebounce = {}
REvtPurchase.OnServerEvent:Connect(function(player, skillName: { 'Quake'|'Fire'|'Ice'|'Snow' })
	if not playerPurchaseDebounce[player] then playerPurchaseDebounce[player] = {} end
	if playerPurchaseDebounce[player][skillName] then return end
	playerPurchaseDebounce[player][skillName] = true

	local LocaleID = player.LocaleId == 'ko-kr' and 'ko-kr' or 'en-us'


	local vPrice: NumberValue = fProducts[skillName].Price
	local vCoin = vPrice:FindFirstChild('Coin')
	local vGamePass = vPrice:FindFirstChild('GamePass')

	local fStats: Folder = player.Stats
	local vEquippedSkill: StringValue = fStats.EquippedSkill
	local PlayerGui = player.PlayerGui
	local TaggerTowerSkillGui = PlayerGui.TaggerTowerSkill
	local fRightBar = TaggerTowerSkillGui.RightBar
	-- 이미 구매된 제품인지 확인
	local result = CheckPurchased(player, skillName)
	if result then
		playerPurchaseDebounce[player][skillName] = nil
		local message = PurchaseFinishedMessages[2][LocaleID]:format(skillTranslate[skillName][LocaleID])
		REvtPurchase:FireClient(player, message)
		vEquippedSkill.Value = skillName
		for _, ImageButton: ImageButton in fRightBar:GetChildren() do
			if not ImageButton:IsA('ImageButton') then continue end
			ImageButton.Visible = false
		end
		local ImageButton: ImageButton = fRightBar[skillName]
		ImageButton.Visible = true
		return
	end

	local vPlayerCoin: NumberValue = fStats.Coin
	if vCoin then
		local newCoinAmount = vPlayerCoin.Value - vPrice.Value
		-- 돈 부족
		if newCoinAmount < 0 then
			local message = PurchaseFinishedMessages[1][LocaleID]
			REvtPurchase:FireClient(player, message)
			playerPurchaseDebounce[player][skillName] = nil
			return
		end
		-- 코인으로 구매
		-- 돈 계산
		vPlayerCoin.Value = newCoinAmount
		-- 스킬 지급
		local fStats: Folder = player.Stats
		local fPurchasedProducts: Folder = fStats.PurchasedProducts
		local Found_vProduct: BoolValue = fPurchasedProducts[skillName]
		if Found_vProduct then
			Found_vProduct.Value = true
			local message = PurchaseFinishedMessages[0][LocaleID]
			REvtPurchase:FireClient(player, message)
			playerPurchaseDebounce[player][skillName] = nil
			return
		end

	elseif vGamePass then
		-- prompt puarchase
		local success, err = pcall(function()
			MarketplaceService:PromptGamePassPurchase(player, vGamePass.Value)
			playerPurchaseDebounce[player][skillName] = nil
			return
		end)
	else
		print('Other')
	end
	playerPurchaseDebounce[player][skillName] = nil
end)
----`