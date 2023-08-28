export const LuaCodeBlockFalling = `


-- Script by bean7189



--// Services //--
local Players = game:GetService('Players')
local TweenService = game:GetService('TweenService')
local Debris = game:GetService('Debris')
----



--// Constants //--
local FALLING_TOUCHED_COLOR = script.TouchedColor.Value
local FALLING_WAIT_TIME = script.WaitTime.Value
local FALLING_RESPAWN_TIME = script.RespawnTime.Value
----



--// Variables //--
local TouchedConnections = {}
----



--// Functions //--

local function OnFallingBlockTouch(block: BasePart)
	local vTouchedColor: Color3Value = block:FindFirstChild('TouchedColor')
	local vWaitTime: NumberValue = block:FindFirstChild('WaitTime')
	local vRespawnTime: NumberValue = block:FindFirstChild('RespawnTime')
	local touchedColor = (vTouchedColor and vTouchedColor.Value) and vTouchedColor.Value or FALLING_TOUCHED_COLOR
	local waitTime = (vWaitTime and vWaitTime.Value) and vWaitTime.Value or FALLING_WAIT_TIME
	local respawnTime = (vRespawnTime and vRespawnTime.Value) and vRespawnTime.Value or FALLING_RESPAWN_TIME

	local tweenColor = TweenService:Create(
		block,
		TweenInfo.new(waitTime, Enum.EasingStyle.Linear),
		{Color = block.Color}
	)


	local connection = TouchedConnections
	local debounce = false
	connection = block.Touched:Connect(function(coll)
		print('test01')
		if debounce then return end
		print('test02')
		local character = coll.Parent
		print('test03')
		if not character then return end
		print('character: ', character)
		print('test04')
		local player = Players:GetPlayerFromCharacter(character)
		print('test05')
		if not player then return end
		print('test06')
		local Humanoid = character:FindFirstChildOfClass('Humanoid')
		print('test07')
		if not Humanoid then return end
		print('test08')
		if not (Humanoid.Health > 0) then return end
		print('test09')


		debounce = true

		block.Color = touchedColor
		tweenColor:Play()
		task.wait(waitTime)
		local previousBlockParent = block.Parent
		block.Parent = nil
		local Cloned_block = block:Clone()
		Cloned_block.Parent = previousBlockParent
		Cloned_block.CanCollide = false
		Cloned_block.Anchored = false
		Debris:AddItem(Cloned_block, respawnTime)
		task.wait(respawnTime)
		block.Parent = previousBlockParent
		print('test10')

		debounce = false
	end)
	if not TouchedConnections.Falling then TouchedConnections.Falling = {} end
	table.insert(TouchedConnections.Falling, connection)
end

local function InitializeFallingBlocks()
	for _, block: BasePart in pairs(workspace:GetDescendants()) do
		if not block:IsA('BasePart') then continue end
		if not string.find(block.Name, 'Falling') then continue end


		OnFallingBlockTouch(block)
	end
end

----



--// Main //--
InitializeFallingBlocks()
----`