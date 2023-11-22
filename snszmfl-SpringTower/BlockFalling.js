export const LuaCodeBlockFalling = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
 Copyright 2023. bean7189 All rights reserved.
]]



--// Service //--
local Players = game:GetService('Players')
local TweenService = game:GetService('TweenService')
local Debris = game:GetService('Debris')
----



--// Presetup //--

----



--// Types //--

----



--// Constants //--
local FALLING_WAIT_TIME = 0.2
local FALLING_TOUCHED_COLOR = Color3.new(1, 1, 1)
local FALLING_RESPAWN_TIME = 4
----



--// Remotes //--

----



--// Modules //--

----



--// Variables //--
local TouchedConnections = {
	['Falling'] = {},
}
----



--// Functions //--
local function IsInvalidCharacter(character: Model)
	local player: Player = Players:GetPlayerFromCharacter(character)
	if not player then return end

	local Humanoid: Humanoid = character:FindFirstChildOfClass('Humanoid')
	if not Humanoid then return end
	if not (Humanoid.Health > 0) then return end

	local HRP: Part = character:FindFirstChild('HumanoidRootPart')
	if not HRP then return end


	return true
end


local function InitFalling(block: BasePart)
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
		if debounce then return end
		local character = coll.Parent
		if not character then return end
		if not IsInvalidCharacter(character) then return end


		local Humanoid = character:FindFirstChildOfClass('Humanoid')

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

		debounce = false
	end)
	if not TouchedConnections.Falling then TouchedConnections.Falling = {} end
	table.insert(TouchedConnections.Falling, connection)


	-- Create water mark
	local SurfaceGui = Instance.new('SurfaceGui')
	SurfaceGui.Parent = block
	SurfaceGui.Name = 'WaterMarkGui'
	SurfaceGui.Face = Enum.NormalId.Top
	SurfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud
	SurfaceGui.LightInfluence = 1
	SurfaceGui.MaxDistance = 1000
	SurfaceGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
	local UIPadding = Instance.new('UIPadding')
	UIPadding.Parent = SurfaceGui
	UIPadding.PaddingBottom = UDim.new(0.05, 0)
	UIPadding.PaddingLeft = UDim.new(0.05, 0)
	UIPadding.PaddingRight = UDim.new(0.05, 0)
	UIPadding.PaddingTop = UDim.new(0.05, 0)
	local CanvasGroup = Instance.new('CanvasGroup')
	CanvasGroup.Parent = SurfaceGui
	CanvasGroup.BackgroundTransparency = 1
	CanvasGroup.GroupTransparency = 1
	CanvasGroup.Size = UDim2.new(1, 0, 1, 0)
	local TextLabel = Instance.new('TextLabel')
	TextLabel.Parent = CanvasGroup
	TextLabel.Name = 'WaterMarkLabel'
	TextLabel.BackgroundTransparency = 1
	TextLabel.Font = Enum.Font.SourceSans
	TextLabel.Text = 'Made by bean7189'
	TextLabel.TextScaled = true
	TextLabel.Size = UDim2.new(1, 0, 1, 0)
	TextLabel.TextTransparency = 0
	local UIStroke = Instance.new('UIStroke')
	UIStroke.Parent = TextLabel
	UIStroke.Thickness = 2
	UIStroke.Color = Color3.new(1, 1, 1)
	task.spawn(function()
		while true do
			local tweenInfoOn = TweenInfo.new(
				1,
				Enum.EasingStyle.Linear,
				Enum.EasingDirection.InOut,
				0,
				false
			)
			local tweenOn = TweenService:Create(
				CanvasGroup,
				tweenInfoOn,
				{ GroupTransparency = 0 }
			)
			local tweenOff = TweenService:Create(
				CanvasGroup,
				tweenInfoOn,
				{ GroupTransparency = 1 }
			)
			tweenOn:Play()
			tweenOn.Completed:Wait()
			task.wait(1)
			tweenOff:Play()
			tweenOff.Completed:Wait()

			task.wait(30)
		end
	end)
end
----



--// Setup //--

----



--// Main //--
for _, block: BasePart in pairs(workspace:GetDescendants()) do
	task.spawn(function()
		local nameTable = string.split(block.Name, '-')
		local isBlock = nameTable[1] == 'Block'
		if not isBlock then return end
		local BlockType = nameTable[2]
		if block:IsA('Model') then return end

		if not BlockType or BlockType ~= 'Falling' then return end
		InitFalling(block)
	end)
end
----`