export const LuaCodeBlockPushing = `



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
local PUSHING_PUSH_TIME = 0.35
local PUSHING_RETURN_TIME = 0.75
local PUSHING_WAIT_TIME = 5
----



--// Remotes //--

----



--// Modules //--

----



--// Variables //--
local Coroutines = {
	['Pushing'] = {},
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


local function RunPushing(Pusher: BasePart, tweenPush: Tween, tweenReturn: Tween, waitTime: number)
	while true do
		tweenPush:Play()
		tweenPush.Completed:Wait()
		tweenReturn:Play()
		tweenReturn.Completed:Wait()
		task.wait(waitTime)
	end
end


local function InitPushing(block: BasePart)
	local Pusher: BasePart = block:FindFirstChild('Pusher')
	assert(Pusher)
	local pushStart: BasePart = block:FindFirstChild('PushStart')
	if not pushStart then warn('[Server] PushStart 파트가 존재해야 합니다: ', tostring(Pusher:GetFullName())) end
	local pushEnd: BasePart = block:FindFirstChild('PushEnd')
	if not pushEnd then warn('[Server] PushEnd 파트가 존재해야 합니다: ', tostring(Pusher:GetFullName())) end

	-- Pusher 파트 무게 제거
	Pusher.Massless = true
	-- PushStart 파트 투명화
	pushStart.Transparency = 1
	-- PushEnd 파트 투명화
	pushEnd.Transparency = 1

	-- Block-Pushing 파트와 Pusher 간 충돌 발생하지 않도록 설정
	local NoCollisionConstraint = Instance.new('NoCollisionConstraint')
	NoCollisionConstraint.Parent = block
	NoCollisionConstraint.Part0 = block
	NoCollisionConstraint.Part1 = Pusher

	local vPushTime: NumberValue = Pusher.Parent:FindFirstChild('PushTime')
	local pushTime = (vPushTime and vPushTime.Value) and vPushTime.Value or PUSHING_PUSH_TIME
	local vReturnTime: NumberValue = Pusher.Parent:FindFirstChild('ReturnTime')
	local returnTime = (vReturnTime and vReturnTime.Value) and vReturnTime.Value or PUSHING_RETURN_TIME
	local vWaitTime: NumberValue = Pusher.Parent:FindFirstChild('WaitTime')
	local waitTime = (vWaitTime and vWaitTime.Value) and vWaitTime.Value or PUSHING_WAIT_TIME

	local tweenPush = TweenService:Create(
		Pusher,
		TweenInfo.new(pushTime, Enum.EasingStyle.Linear),
		{ Position = pushEnd.Position }
	)
	local tweenRetrun = TweenService:Create(
		Pusher,
		TweenInfo.new(returnTime, Enum.EasingStyle.Linear),
		{ Position = pushStart.Position }
	)

	local coRunPushing = coroutine.create(RunPushing)
	coroutine.resume(coRunPushing, Pusher, tweenPush, tweenRetrun, waitTime)
	table.insert(Coroutines.Pushing, coRunPushing)


	-- Create water mark
	local SurfaceGui = Instance.new('SurfaceGui')
	SurfaceGui.Parent = Pusher
	SurfaceGui.Name = 'WaterMarkGui'
	SurfaceGui.Face = Enum.NormalId.Right
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

		if not BlockType or BlockType ~= 'Pushing' then return end
		InitPushing(block)
	end)
end
----`