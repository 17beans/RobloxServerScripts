export const LuaCodeThrowCharacterSystem = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
]]



--// Service //--
local Players = game:GetService('Players')
local ReplicatedStorage = game:GetService('ReplicatedStorage')
local TweenService = game:GetService('TweenService')
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
local fThrowCharacterSystemReplicated = ReplicatedStorage['ThrowCharacterSystem']
local fRemotes = fThrowCharacterSystemReplicated['Remotes']

----// Settings //----
local CannotTouchEndedTime = 0.25
--------
----



--// Remotes / Bindables //--
local RFncThrow: RemoteFunction = fRemotes['Throw']
----



--// Modules //--
type TypeSettings = {
	['Enum']: {
		Lift: number,
		Put: number,
		Throw: number,
	},

	['CanThrowPlayerCharacter']: boolean,

	['KeyCodeLift/Put']: Enum.KeyCode,
	['KeyCodeThrow']: Enum.KeyCode,

	['ThrowPower']: number,
	['ThrowHeight']: number,

	['LockCoolTime']: number,
	['UnlockHeight']: number,

	['DetectDistance']: number,

	['ButtonTexts']: {
		['Lift']: {
			['ko-kr']: string,
			['en-us']: string,
		},
		['Put']: {
			['ko-kr']: string,
			['en-us']: string,
		},
		['Throw']: {
			['ko-kr']: string,
			['en-us']: string,
		},
	},
}
local Settings: TypeSettings = require(fThrowCharacterSystemReplicated['Settings'])
----



--// Variables //--

----



--// Functions //--
local function ThrowCharacter(targetCharacter: Model)
	task.spawn(function()
		local Humanoid = targetCharacter:FindFirstChildOfClass('Humanoid')

		Humanoid.PlatformStand = true

		task.wait(Settings.LockCoolTime)

		targetCharacter:PivotTo(
			CFrame.new(
				targetCharacter.PrimaryPart.CFrame.Position + Vector3.new(0, Settings.UnlockHeight, 0),
				targetCharacter.PrimaryPart.CFrame.LookVector
			)
		)

		Humanoid.PlatformStand = false
	end)
end

local function CreateRayPart(character: Model, FrontDistance: number, oddCount: number)
	assert(character, 'Invalid argument #1. Model expected, got nil.')
	assert(FrontDistance, 'Invalid argument #2. number expected, got nil.')
	assert(oddCount, 'Invalid argument #3. Odd number exptected, got nil.')

	assert(character:IsA('Model'), ('Invalid argument #1. Model expected, got %s.'):format(typeof(character)))
	assert(typeof(FrontDistance) == 'number', ('Invalid argument #2. number expected, got %s.'):format(typeof(FrontDistance)))
	assert(typeof(oddCount) == 'number', ('Invalid argument #3. Odd number expected, got %s'):format(typeof(oddCount)))

	assert(oddCount%2 == 1, 'Invalid argument #3. Odd number expected, got even number.')


	local RayPart = Instance.new('Part')
	RayPart.Parent = character
	RayPart.Name = 'RayPart'
	RayPart.Size = Vector3.new(0.5, 0.25, 0.25)
	RayPart.CanCollide = false
	RayPart.Transparency = 1
	RayPart.CanTouch = false
	RayPart.Massless = true
	RayPart.CFrame = character.PrimaryPart.CFrame * CFrame.new(
		Vector3.new(0, 0, -FrontDistance)
	)

	local WeldConstraint = Instance.new('WeldConstraint')
	WeldConstraint.Parent = RayPart
	WeldConstraint.Part0 = RayPart
	WeldConstraint.Part1 = character.PrimaryPart

	for i=1, (oddCount-1)/2, 1 do
		local RayPartA = Instance.new('Part')
		RayPartA.Parent = character
		RayPartA.Name = 'RayPart'
		RayPartA.Size = Vector3.new(0.5, 0.25, 0.25)
		RayPartA.CanCollide = false
		RayPartA.Transparency = 1
		RayPartA.CanTouch = false
		RayPartA.Massless = true
		RayPartA.CFrame = character.PrimaryPart.CFrame * CFrame.new(
			Vector3.new(i, 0, -( FrontDistance-(i/2-0.25) ))
		)
		RayPartA.CFrame = CFrame.lookAt(RayPartA.CFrame.Position, character.PrimaryPart.CFrame.Position)

		local WeldConstraint = Instance.new('WeldConstraint')
		WeldConstraint.Parent = RayPartA
		WeldConstraint.Part0 = RayPartA
		WeldConstraint.Part1 = character.PrimaryPart


		local RayPartB = Instance.new('Part')
		RayPartB.Parent = character
		RayPartB.Name = 'RayPart'
		RayPartB.Size = Vector3.new(0.5, 0.25, 0.25)
		RayPartB.CanCollide = false
		RayPartB.Transparency = 1
		RayPartB.CanTouch = false
		RayPartB.Massless = true
		RayPartB.CFrame = character.PrimaryPart.CFrame * CFrame.new(
			Vector3.new(-i, 0, -( FrontDistance-(i/2-0.25) ))
		)
		RayPartB.CFrame = CFrame.lookAt(RayPartB.CFrame.Position, character.PrimaryPart.CFrame.Position)

		local WeldConstraint = Instance.new('WeldConstraint')
		WeldConstraint.Parent = RayPartB
		WeldConstraint.Part0 = RayPartB
		WeldConstraint.Part1 = character.PrimaryPart
	end
end


local function GetThrowCharacterSystemFolder(player: Player)
	local fThrowCharacterSystem: Folder = player:FindFirstChild('ThrowCharacterSystem')

	if not fThrowCharacterSystem then
		fThrowCharacterSystem = Instance.new('Folder')
		fThrowCharacterSystem.Parent = player
		fThrowCharacterSystem.Name = 'ThrowCharacterSystem'
		return fThrowCharacterSystem

	else

		return fThrowCharacterSystem
	end

end

local function CreateValueHoldingCharacter(player: Player)
	assert(player, 'Invalid argument #1. Player expected, got nil.')

	local vHoldingCharacter = Instance.new('ObjectValue')
	vHoldingCharacter.Parent = GetThrowCharacterSystemFolder(player)
	vHoldingCharacter.Name = 'HoldingCharacter'

	return vHoldingCharacter
end

local function CreateValueLastHoldCharacter(player: Player)
	assert(player, 'Invalid argument #1. Player expected, got nil.')

	local vLastHoldCharacter = Instance.new('ObjectValue')
	vLastHoldCharacter.Parent = GetThrowCharacterSystemFolder(player)
	vLastHoldCharacter.Name = 'LastHoldCharacter'

	return vLastHoldCharacter
end

local function SetCollideCharacter(targetCharacter: Model, CanCollide: boolean)
	for _, targetBasePart in targetCharacter:GetChildren() do
		task.spawn(function()
			if targetBasePart.Name == 'LiftDetectPart' then return end
			if not targetBasePart:IsA('BasePart') then return end
			targetBasePart.CanCollide = CanCollide
			targetBasePart.Massless = not CanCollide
		end)
	end
end

local function OnChangeValueHoldingCharacter(vHoldingCharacter: ObjectValue, vLastHoldCharacter: ObjectValue, RequestPlayer: Player)

	local RequestCharacter = RequestPlayer.Character
	if not RequestCharacter then return end
	local targetCharacter: Model = vHoldingCharacter.Value

	if vHoldingCharacter.Value then
		-- Last hold character 설정
		vLastHoldCharacter.Value = vHoldingCharacter.Value

		-- Socket 생성
		local HandPart: BasePart = RequestCharacter:FindFirstChild('RightHand') or RequestCharacter['Right Arm']
		local Attachment0 = HandPart.RightGripAttachment
		--local Attachment1 = targetCharacter.Head.FaceCenterAttachment
		local Attachment1 = targetCharacter.PrimaryPart.RootAttachment
		local BallSocketConstraint = Instance.new('BallSocketConstraint')
		--BallSocketConstraint.Parent = RequestCharacter
		BallSocketConstraint.Parent = vHoldingCharacter.Value
		BallSocketConstraint.Name = 'Lift/ThrowSocket'
		BallSocketConstraint.Attachment0 = Attachment0
		BallSocketConstraint.Attachment1 = Attachment1
		BallSocketConstraint.LimitsEnabled = true
		BallSocketConstraint.TwistLimitsEnabled = true
		BallSocketConstraint.TwistLowerAngle = -15
		BallSocketConstraint.TwistUpperAngle = 15


	else

		-- Socket 제거
		local socket: BallSocketConstraint = vLastHoldCharacter.Value['Lift/ThrowSocket']
		socket:Destroy()
		socket = nil
		SetCollideCharacter(vLastHoldCharacter.Value, true)
	end
end

local function CreateValueCannotLift(player: Player)
	local vCannotLift = Instance.new('BoolValue')
	vCannotLift.Parent = GetThrowCharacterSystemFolder(player)
	vCannotLift.Name = 'CannotLift'

	return vCannotLift
end

----// Archived_Server side game control functions //----
--local function CreateValueTouchingCharacter(player: Player)
--	assert(player, 'Invalid argument #1. Player expected, got nil.')

--	local vTouchingCharacter = Instance.new('ObjectValue')
--	vTouchingCharacter.Parent = GetThrowCharacterSystemFolder(player)
--	vTouchingCharacter.Name = 'TouchingCharacter'

--	return vTouchingCharacter
--end

--local function CreateLiftDetectPart(character: Model)
--	local LiftDetectPart = Instance.new('Part')
--	LiftDetectPart.Parent = character
--	LiftDetectPart.Name = 'LiftDetectPart'
--	LiftDetectPart.Massless = true
--	LiftDetectPart.Transparency = 1
--	LiftDetectPart.Size = character.PrimaryPart.Size + Vector3.new(4, 4, 4)
--	LiftDetectPart.CanCollide = false
--	--LiftDetectPart.CanQuery = false
--	LiftDetectPart.CFrame = character.PrimaryPart.CFrame
--	local WeldConstraint = Instance.new('WeldConstraint')
--	WeldConstraint.Parent = LiftDetectPart
--	WeldConstraint.Part0 = LiftDetectPart
--	WeldConstraint.Part1 = character.PrimaryPart

--	return LiftDetectPart
--end

--local touchedDebounces = {}
--local touchendedDebounces = {}
--local function OnTouchedLiftDetectPart(coll: BasePart, targetCharacter: Model)
--	if touchedDebounces[targetCharacter] then return end
--	local touchedCharacter = coll.Parent
--	if not touchedCharacter then return end
--	if coll.Name ~= 'HumanoidRootPart' then return end
--	local touchedPlayer = Players:GetPlayerFromCharacter(touchedCharacter)
--	if not touchedPlayer then return end
--	local Humanoid = touchedCharacter:FindFirstChildOfClass('Humanoid')
--	if not Humanoid then return end
--	if not (Humanoid.Health > 0) then return end


--	---- 한번 터치 되면 일정 시간 동안 TouchEnd가 발생하지 않도록
--	--task.spawn(function()
--	--	touchendedDebounces[targetCharacter] = true
--	--	task.wait(CannotTouchEndedTime)
--	--	touchendedDebounces[targetCharacter] = false
--	--end)
--	touchedDebounces[targetCharacter] = true

--	local vTouchingCharacter: ObjectValue = touchedPlayer:FindFirstChild('TouchingCharacter')
--	vTouchingCharacter.Value = targetCharacter

--	touchedDebounces[targetCharacter] = false
--end

--local function OnTouchEndedLiftDetectPart(coll: BasePart, character: Model)
--	if touchendedDebounces[character] then return end
--	local touchedCharacter = coll.Parent
--	if not touchedCharacter then return end
--	local touchedPlayer = Players:GetPlayerFromCharacter(touchedCharacter)
--	if not touchedPlayer then return end
--	local Humanoid = touchedCharacter:FindFirstChildOfClass('Humanoid')
--	if not Humanoid then return end
--	if not (Humanoid.Health > 0) then return end


--	touchendedDebounces[character] = true

--	local vTouchingCharacter: ObjectValue = touchedPlayer:FindFirstChild('TouchingCharacter') or CreateValueTouchingCharacter(touchedPlayer)
--	vTouchingCharacter.Value = nil

--	touchendedDebounces[character] = false
--end
--------


local function SetupNPC()
	for _, npc: Model in workspace:GetDescendants() do
		if not npc:IsA('Model') then continue end
		local Humanoid = npc:FindFirstChildOfClass('Humanoid')
		if not Humanoid then continue end
		local player = Players:GetPlayerFromCharacter(npc)
		if player then continue end


		--;(function()
		--	local LiftDetectPart = CreateLiftDetectPart(npc)

		--	LiftDetectPart.Touched:Connect(function(coll) OnTouchedLiftDetectPart(coll, npc) end)

		--	LiftDetectPart.TouchEnded:Connect(function(coll) OnTouchEndedLiftDetectPart(coll, npc) end)
		--end)()

		--;(function()
		--	local vCannotLift = CreateValueCannotLift(npc)
		--	vCannotLift:GetPropertyChangedSignal('Value'):Connect(function()
		--		OnChangeValueCannotLift(vCannotLift, npc)
		--	end)
		--end)()

	end
end
----



--// Setup //--

----



--// Main //--
local playerAdded = {}
local function OnPlayerAdded(player: Player)
	playerAdded[player] = true

	--CreateValueTouchingCharacter(player)

	local character = player.Character
	if not character then character = player.CharacterAppearanceLoaded:Wait() end

	-- Setup raycast part
	CreateRayPart(character, 4, 5)

	-- Setup Value Last Hold Character
	local vLastHoldCharacter = CreateValueLastHoldCharacter(player)

	-- Setup Value Holding Character
	local vHoldingCharacter = CreateValueHoldingCharacter(player)
	vHoldingCharacter:GetPropertyChangedSignal('Value'):Connect(function()
		OnChangeValueHoldingCharacter(vHoldingCharacter, vLastHoldCharacter, player)
	end)

	-- Setup LiftDetectPart
	--;(function()
	--	local LiftDetectPart = CreateLiftDetectPart(character)

	--	--LiftDetectPart.Touched:Connect(function(coll) OnTouchedLiftDetectPart(coll, character) end)

	--	--LiftDetectPart.TouchEnded:Connect(function(coll) OnTouchEndedLiftDetectPart(coll, character) end)
	--end)()

	-- Setup vCannotLift
	local vCannotLift = CreateValueCannotLift(player)
end

local function CheckPlayerAdded()
	for _, player in pairs(Players:GetPlayers()) do
		if playerAdded[player] then continue end
		OnPlayerAdded(player)
	end
end

local function OnPlayerRemoving(player: Player)
	playerAdded[player] = nil
end
Players.PlayerAdded:Connect(OnPlayerAdded)
Players.PlayerRemoving:Connect(OnPlayerRemoving)
CheckPlayerAdded()


RFncThrow.OnServerInvoke = function(RequestPlayer: Player, targetCharacter: Model, messageType: number)
	print('messageType: ', messageType)
	local RequestCharacter = RequestPlayer.Character

	local fThrowCharacterSystemPlayer: Folder = GetThrowCharacterSystemFolder(RequestPlayer)
	local vHoldingCharacter: ObjectValue = fThrowCharacterSystemPlayer: WaitForChild('HoldingCharacter', 5)

	if messageType == Settings.Enum.Lift and not vHoldingCharacter.Value then
		local targetHumanoid = targetCharacter:FindFirstChildOfClass('Humanoid')
		--if targetHumanoid.PlatformStand == true then return end

		local targetPlayer = Players:GetPlayerFromCharacter(vHoldingCharacter.Value)
		if targetPlayer then
			local vCannotLift: BoolValue = fThrowCharacterSystemPlayer:FindFirstChild('CannotLift')
			vCannotLift.Value = true
		end

		vHoldingCharacter.Value = targetCharacter
		SetCollideCharacter(targetCharacter, false)

		return messageType

	else

		local vLastHoldCharacter: ObjectValue = fThrowCharacterSystemPlayer:FindFirstChild('LastHoldCharacter')

		if vLastHoldCharacter.Value:FindFirstChild('Lift/ThrowSocket') then

			local vHoldingCharacter: ObjectValue = fThrowCharacterSystemPlayer:FindFirstChild('HoldingCharacter')
			vHoldingCharacter.Value = nil

			local targetPlayer = Players:GetPlayerFromCharacter(vLastHoldCharacter.Value)
			if targetPlayer then
				local fThrowCharacterSystemTargetPlayer: Folder = targetPlayer['ThrowCharacterSystem']
				local vCannotLift: BoolValue = fThrowCharacterSystemTargetPlayer:FindFirstChild('CannotLift')
				print('cannot lift change')
				vCannotLift.Value = false
			end
			print('vLastHoldCharacter.Value: ', vLastHoldCharacter.Value)
			print('targetPlayer: ', targetPlayer)

			if messageType == Settings.Enum.Throw then
				local BodyForce = Instance.new('BodyForce')
				BodyForce.Parent = vLastHoldCharacter.Value.HumanoidRootPart
				local LookVector = RequestCharacter:GetPivot().LookVector
				BodyForce.Force = LookVector * Settings['ThrowPower'] * Vector3.new(1, Settings['ThrowHeight'], 1)
				local tweenInfo = TweenInfo.new(1)
				local goal = {Force = Vector3.new(0, 0, 0)}
				TweenService:Create(BodyForce, tweenInfo, goal):Play()

				ThrowCharacter(vLastHoldCharacter.Value)

				return messageType
			end

			vHoldingCharacter.Value = nil

			return messageType
		end

	end
end


SetupNPC()
----`