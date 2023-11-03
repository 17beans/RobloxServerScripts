export const LuaCodeThrowCharacterSystem = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
]]



--// Service //--
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
local fThrowCharacterSystem = ReplicatedStorage['ThrowCharacterSystem']
local fRemotes = fThrowCharacterSystem['Remotes']

----// Settings //----
local CannotTouchEndedTime = 0.25
--------
----



--// Remotes / Bindables //--
local REvtThrow = fRemotes['Throw']
----



--// Modules //--
local Settings = require(fThrowCharacterSystem['Settings'])
----



--// Variables //--
local currentChararcter
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

local function CreateValueTouchingCharacter(player: Player)
	local vTouchingCharacter = Instance.new('ObjectValue')
	vTouchingCharacter.Parent = player
	vTouchingCharacter.Name = 'TouchingCharacter'

	return vTouchingCharacter
end

local function CreateValueIsLifting(character: Model)
	local vIsLifting = Instance.new('BoolValue')
	vIsLifting.Parent = character
	vIsLifting.Name = 'IsLifting'

	return vIsLifting
end

local function CreateValueIsHandling(player: Player)
	local vIsHandling = Instance.new('BoolValue')
	vIsHandling.Parent = player
	vIsHandling.Name = 'IsHandling'

	return vIsHandling
end

local function OnIsLiftingChange(vIsLifting: BoolValue, character: Model)
	if vIsLifting.Value then
		for _, targetBasePart in character:GetChildren() do
			task.spawn(function()
				if targetBasePart.Name == 'LiftDetectPart' then return end
				if not targetBasePart:IsA('BasePart') then return end
				targetBasePart.CanCollide = false
				targetBasePart.Massless = true
			end)
		end
	else
		for _, targetBasePart in character:GetChildren() do
			task.spawn(function()
				if targetBasePart.Name == 'LiftDetectPart' then return end
				if not targetBasePart:IsA('BasePart') then return end
				targetBasePart.CanCollide = true
				targetBasePart.Massless = false
			end)
		end
	end
end

local function CreateLiftDetectPart(character: Model)
	local LiftDetectPart = Instance.new('Part')
	LiftDetectPart.Parent = character
	LiftDetectPart.Name = 'LiftDetectPart'
	LiftDetectPart.Massless = true
	LiftDetectPart.Transparency = 1
	LiftDetectPart.Size = character.PrimaryPart.Size + Vector3.new(4, 4, 4)
	LiftDetectPart.CanCollide = false
	--LiftDetectPart.CanQuery = false
	LiftDetectPart.CFrame = character.PrimaryPart.CFrame
	local WeldConstraint = Instance.new('WeldConstraint')
	WeldConstraint.Parent = LiftDetectPart
	WeldConstraint.Part0 = LiftDetectPart
	WeldConstraint.Part1 = character.PrimaryPart

	return LiftDetectPart
end

--local touchedDebounces = {}
--local touchendedDebounces = {}
--local function OnTouchedLiftDetectPart(coll: BasePart, targetCharacter: Model)
--	if touchedDebounces[targetCharacter] then return end
--	local touchedCharacter = coll.Parent
--	if not touchedCharacter then return end
--	if coll.Name ~= 'HumanoidRootPart' then return end
--	local touchedPlayer = game.Players:GetPlayerFromCharacter(touchedCharacter)
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
--	local touchedPlayer = game.Players:GetPlayerFromCharacter(touchedCharacter)
--	if not touchedPlayer then return end
--	local Humanoid = touchedCharacter:FindFirstChildOfClass('Humanoid')
--	if not Humanoid then return end
--	if not (Humanoid.Health > 0) then return end


--	touchendedDebounces[character] = true

--	local vTouchingCharacter: ObjectValue = touchedPlayer:FindFirstChild('TouchingCharacter') or CreateValueTouchingCharacter(touchedPlayer)
--	vTouchingCharacter.Value = nil

--	touchendedDebounces[character] = false
--end


local function SetupNPC()
	for _, npc: Model in workspace:GetDescendants() do
		if not npc:IsA('Model') then continue end
		local Humanoid = npc:FindFirstChildOfClass('Humanoid')
		if not Humanoid then continue end
		local player = game.Players:GetPlayerFromCharacter(npc)
		if player then continue end


		--;(function()
		--	local LiftDetectPart = CreateLiftDetectPart(npc)

		--	LiftDetectPart.Touched:Connect(function(coll) OnTouchedLiftDetectPart(coll, npc) end)

		--	LiftDetectPart.TouchEnded:Connect(function(coll) OnTouchEndedLiftDetectPart(coll, npc) end)
		--end)()

		;(function()
			local vIsLifting = CreateValueIsLifting(npc)
			vIsLifting:GetPropertyChangedSignal('Value'):Connect(function()
				OnIsLiftingChange(vIsLifting, npc)
			end)
		end)()

	end
end
----



--// Setup //--

----



--// Main //--
local playerAdded = {}
local function OnPlayerAdded(player: Player)
	playerAdded[player] = true

	CreateValueTouchingCharacter(player)

	local character = player.Character
	if not character then character = player.CharacterAppearanceLoaded:Wait() end

	-- Setup raycast part
	CreateRayPart(player.Character, 4, 5)

	-- Setup LiftDetectPart
	;(function()
		local LiftDetectPart = CreateLiftDetectPart(character)

		--LiftDetectPart.Touched:Connect(function(coll) OnTouchedLiftDetectPart(coll, character) end)

		--LiftDetectPart.TouchEnded:Connect(function(coll) OnTouchEndedLiftDetectPart(coll, character) end)
	end)()

	-- Setup vIsLifting
	;(function()
		local vIsLifting = CreateValueIsLifting(character)
		vIsLifting:GetPropertyChangedSignal('Value'):Connect(function()
			OnIsLiftingChange(vIsLifting, character)
		end)
	end)()

	-- Setup vIsHandling
	;(function()
		local vIsHandling = CreateValueIsHandling(player)
		--vIsHandling:GetPropertyChangedSignal('Value'):Connect(function()
		--	OnIsHandlingChange(vIsHandling, character)
		--end)
	end)()
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
game.Players.PlayerAdded:Connect(OnPlayerAdded)
game.Players.PlayerRemoving:Connect(OnPlayerRemoving)
CheckPlayerAdded()


REvtThrow.OnServerEvent:Connect(function(RequestPlayer: Player, targetCharacter: Model, messageType: number)
	local RequestCharacter = RequestPlayer.Character

	if messageType == Settings.Enum.Lift and not currentChararcter then
		local targetHumanoid = targetCharacter:FindFirstChildOfClass('Humanoid')
		if targetHumanoid.PlatformStand == true then return end

		currentChararcter = targetCharacter

		pcall(function()
			RequestPlayer.IsHandling.Value = true
		end)

		--for _, targetBasePart in currentChararcter:GetChildren() do
		--	if not targetBasePart:IsA('BasePart') then continue end
		--	targetBasePart.Massless = true
		--	for _, requestBasePart in RequestCharacter:GetChildren() do
		--		if not requestBasePart:IsA('BasePart') then continue end
		--		local NoCollisionConstraint = Instance.new('NoCollisionConstraint')
		--		NoCollisionConstraint.Parent = targetBasePart
		--		NoCollisionConstraint.Part0 = requestBasePart
		--		NoCollisionConstraint.Part1 = targetBasePart
		--		break
		--	end
		--end
		--for _, targetBasePart in targetCharacter:GetChildren() do
		--	if targetBasePart.Name == 'LiftDetectPart' then continue end
		--	if not targetBasePart:IsA('BasePart') then continue end
		--	targetBasePart.Massless = true
		--	targetBasePart.CanCollide = false
		--end
		-- OnIsLiftingChange()로 이동
		local vIsLifting: BoolValue = currentChararcter:FindFirstChild('IsLifting')
		vIsLifting.Value = true

		local HandPart: BasePart = RequestCharacter:FindFirstChild('RightHand') or RequestCharacter['Right Arm']
		local Attachment0 = HandPart.RightGripAttachment
		--local Attachment1 = targetCharacter.Head.FaceCenterAttachment
		local Attachment1 = targetCharacter.PrimaryPart.RootAttachment
		local BallSocketConstraint = Instance.new('BallSocketConstraint')
		BallSocketConstraint.Parent = RequestCharacter
		BallSocketConstraint.Name = 'Lift/ThrowSocket'
		BallSocketConstraint.Attachment0 = Attachment0
		BallSocketConstraint.Attachment1 = Attachment1
		BallSocketConstraint.LimitsEnabled = true
		BallSocketConstraint.TwistLimitsEnabled = true
		BallSocketConstraint.TwistLowerAngle = -15
		BallSocketConstraint.TwistUpperAngle = 15

	else
		if RequestCharacter:FindFirstChild('Lift/ThrowSocket') then
			RequestCharacter['Lift/ThrowSocket']:Destroy()

			--for _, targetBasePart: BasePart in currentChararcter:GetChildren() do
			--	if not targetBasePart:IsA('BasePart') then continue end
			--	targetBasePart.Massless = false
			--	for _, requestBasePart in RequestCharacter:GetChildren() do
			--		if not requestBasePart:IsA('BasePart') then continue end
			--		pcall(function()
			--			local target: Instance = currentChararcter.NoCollisionConstraint
			--			target:Destroy()
			--		end)
			--		break
			--	end
			--end
			-- playeradded - OnIsLiftingChange()로 이동
			local vIsLifting: BoolValue = currentChararcter:FindFirstChild('IsLifting')
			vIsLifting.Value = false

			pcall(function()
				RequestPlayer.IsHandling.Value = true
			end)

			if messageType == Settings.Enum.Throw then
				local BodyForce = Instance.new('BodyForce')
				BodyForce.Parent = currentChararcter.HumanoidRootPart
				local LookVector = RequestCharacter:GetPivot().LookVector
				BodyForce.Force = LookVector * Settings['ThrowPower'] * Vector3.new(1, Settings['ThrowHeight'], 1)
				local tweenInfo = TweenInfo.new(1)
				local goal = {Force = Vector3.new(0, 0, 0)}
				TweenService:Create(BodyForce, tweenInfo, goal):Play()

				ThrowCharacter(currentChararcter)
			end
		end

		currentChararcter = nil
	end
end)


SetupNPC()
----`