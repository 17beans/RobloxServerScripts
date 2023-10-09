export const LuaCodeSnowball = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
]]



--// Services //--
local Debris = game:GetService('Debris')
local Players = game:GetService('Players')
local ReplicatedStorage = game:GetService('ReplicatedStorage')
----



--// Presetup //--

----



--// Types //--

----



--// Constants //--
local tool = script.Parent
local Handle = tool.Handle
assert(Handle)
local Snowball = tool.Snowball
assert(Snowball)
local GoldSparkles = Snowball.GoldSparkles
assert(GoldSparkles)
local sFreeze = script.Parent.Freeze
local sHit = script.Parent.Hit

local Config = script.Parent:WaitForChild('Config', 5)
assert(Config)
local COOLTIME_THROW = Config.CoolTime_Throw.Value
local LIFETIME_SNOWBALL = Config.LifeTime_Snowball.Value
local FREEZE_TIME = Config.FreezeTime.Value

local LocalPlayer = script.Parent.Parent.Parent
local fPlayerData = LocalPlayer:WaitForChild('PlayerData', 5)
local vIsRewardedGoldSnowball: BoolValue = fPlayerData:WaitForChild('IsRewardedGoldSnowball', 5)
----



--// Remotes / Bindables //--
local REvtThrow = script.Throw
----



--// Modules //--

----



--// Variables //--
local InCoolTime = false
local currentSnowball: BasePart = nil
local owner: Player
----



--// Functions //--
local function PlaySound(sound: Sound, targetPart: BasePart)
	task.spawn(function()
		local Cloned_Sound = sound:Clone()
		Cloned_Sound.Parent = targetPart
		Cloned_Sound:Play()
		Cloned_Sound.Ended:Wait()
		Cloned_Sound:Destroy()
		Cloned_Sound = nil
	end)
end


local function OnEquipped()
	owner = Players:GetPlayerFromCharacter(tool.Parent)
end

local function OnActivated()
	
end

local function OnUnequipped()
	owner = tool.Parent.Parent
end


local function FreezeCharacter(character: Model, player: Player)
	if not character then return end
	local Humanoid = character:FindFirstChildOfClass('Humanoid')
	if not Humanoid then return end
	if not (Humanoid.Health > 0) then return end

	PlaySound(sHit, character.Head)
	PlaySound(sFreeze, character.Head)
	local LocaleID = player.LocaleId == 'ko-kr' and 'ko-kr' or 'en-us'
	local messages = {
		['ko-kr'] = '눈덩이에 맞아 얼음이 되었습니다.',
		['en-us'] = 'You were hit by a snowball and stiffened.',
	}
	local Message = Instance.new('Message')
	Message.Parent = player.PlayerGui
	Message.Text = messages[LocaleID]
	for _, rig: BasePart in character:GetChildren() do
		if not rig:IsA('BasePart') then continue end
		task.spawn(function()
			rig.Anchored = true
			task.wait(3)
			rig.Anchored = false
		end)
	end
	task.wait(3)
	Message:Destroy()
	Message = nil
end

local debounce = false
local touchedConnection: RBXScriptConnection
local function OnTouched(coll: BasePart)
	if debounce then return end
	local character = coll.Parent
	if not character then return end
	local player = Players:GetPlayerFromCharacter(character)
	if not player then return end
	if owner == player then return end
	local Humanoid = character:FindFirstChildOfClass('Humanoid')
	if not Humanoid then return end
	if not (Humanoid.Health > 0) then return end


	debounce = true

	if touchedConnection then
		touchedConnection:Disconnect()
		touchedConnection = nil
	end
	if currentSnowball then
		currentSnowball:Destroy()
		currentSnowball = nil
	end

	FreezeCharacter(character, player)

	debounce = false
end

local function OnThrow(player: Player, mousePosition: Vector3)
	if InCoolTime then return end


	InCoolTime = true
	task.spawn(function()
		task.wait(COOLTIME_THROW)
		InCoolTime = false
	end)
	currentSnowball = Snowball:Clone()
	currentSnowball.Parent = workspace
	currentSnowball.CanTouch = true
	currentSnowball.CFrame = CFrame.new(
		Snowball.CFrame.Position,
		mousePosition
	)

	touchedConnection = currentSnowball.Touched:Connect(OnTouched)

	local destination = mousePosition
	local startPosition = currentSnowball.Position
	local direction = destination - startPosition

	local AttachmentA = Instance.new('Attachment')
	AttachmentA.Parent = currentSnowball
	AttachmentA.Position = Vector3.new(-0.5, 0, 0)
	local AttachmentB = Instance.new('Attachment')
	AttachmentB.Parent = currentSnowball
	AttachmentB.Position = Vector3.new(0.5, 0, 0)
	local Trail = Instance.new('Trail')
	Trail.Parent = currentSnowball
	Trail.Attachment0 = AttachmentA
	Trail.Attachment1 = AttachmentB
	Trail.Color = ColorSequence.new(Color3.new(1, 1, 1))
	pcall(function() Debris:AddItem(currentSnowball, LIFETIME_SNOWBALL) end)
	local connection: RBXScriptConnection
	connection = currentSnowball.Destroying:Connect(function()
		connection:Disconnect()
		connection = nil
		currentSnowball = nil
	end)

	local BodyVelocity = Instance.new('BodyVelocity')
	BodyVelocity.Parent = currentSnowball
	BodyVelocity.MaxForce = Vector3.new(math.huge, math.huge, math.huge)
	BodyVelocity.P = 3000
	BodyVelocity.Velocity = direction.Unit * 100
end


local function ChangeSnowballDesign()
	if not vIsRewardedGoldSnowball.Value then return end

	Snowball.Color = GoldSparkles.SparkleColor
	GoldSparkles.Enabled = true
	tool.Name = 'GoldSnowball'
end

local function SetupGoldSnowballRewarded()
	vIsRewardedGoldSnowball:GetPropertyChangedSignal('Value')
		:Connect(ChangeSnowballDesign)
end
----



--// Setup //--

----



--// Main //--
tool.Equipped:Connect(OnEquipped)
tool.Activated:Connect(OnActivated)
tool.Unequipped:Connect(OnUnequipped)
REvtThrow.OnServerEvent:Connect(OnThrow)
SetupGoldSnowballRewarded()
ChangeSnowballDesign()
----`