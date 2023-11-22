export const LuaCodeBlockMovingSeat = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
 Copyright 2023. bean7189 All rights reserved.
]]



--// Service //--
local Players = game:GetService('Players')
local TweenService = game:GetService('TweenService')
----



--// Presetup //--

----



--// Types //--

----



--// Constants //--
local MOVING_SPEED = 15
local MOVING_SEAT_SPEED = 10
----



--// Remotes //--

----



--// Modules //--

----



--// Variables //--

----



--// Functions //--
local function InitMovingSeat(block: BasePart)
	local moveStart: BasePart = block:FindFirstChild('Start')
	if not moveStart then warn('[Server] Moving 블록에 Start 파트가 존재해야 합니다: ' .. tostring(block:GetFullName())) return end
	local moveEnd: BasePart = block:FindFirstChild('End')
	if not moveEnd then warn('[Server] Moving 블록에 End 파트가 존재해야 합니다: ' .. tostring(block:GetFullName())) return end

	local vSpeed: NumberValue = block:FindFirstChild('Speed')
	local Speed = (vSpeed and vSpeed.Value) and vSpeed.Value or MOVING_SEAT_SPEED
	Speed *= 0.005

	block.Anchored = true
	block.Transparency = 1
	block.CanCollide = false
	block.CanQuery = false
	block.CanTouch = false

	local PrevStartCFrame = moveStart.CFrame
	local distance = math.abs(moveStart.Position.Magnitude - moveEnd.Position.Magnitude)

	moveStart.Anchored = true
	moveStart.CanCollide = true
	moveStart.CanQuery = false
	moveStart.Massless = true
	moveEnd.Anchored = true
	moveEnd.CanCollide = true
	moveEnd.CanTouch = false
	moveEnd.Massless = true

	local debounce = false
	moveStart.Touched:Connect(function(coll)
		if debounce then return end
		local character = coll.Parent
		if not character then return end
		local player = Players:GetPlayerFromCharacter(character)
		if not player then return end
		local Humanoid = character:FindFirstChildOfClass('Humanoid')
		if not Humanoid then return end
		if not (Humanoid.Health > 0) then return end
		if Humanoid.Sit then return end

		task.wait()
		debounce = true


		;(function()
			local returnCondition = false
			local Seat = Instance.new('Seat')
			Seat.Parent = block
			Seat.Anchored = false
			Seat.Transparency = 0
			Seat.CanCollide = false
			Seat.CanQuery = false
			Seat.Size = moveStart.Size - Vector3.new(0, 0.001, 0)
			Seat.CFrame = CFrame.new(moveStart.CFrame.Position, moveEnd.CFrame.Position)
			Seat:Sit(Humanoid)

			local WeldConstraint = Instance.new('WeldConstraint')
			WeldConstraint.Parent = Seat
			WeldConstraint.Part0 = Seat
			WeldConstraint.Part1 = moveStart

			Seat:GetPropertyChangedSignal('Occupant'):Connect(function()
				if Seat.Occupant == nil then Seat:Destroy() end
			end)

			task.spawn(function()
				local tweenStart = TweenService:Create(
					Seat,
					TweenInfo.new(distance * Speed, Enum.EasingStyle.Linear),
					{ Position = moveEnd.Position }
				)
				local tweenEnd = TweenService:Create(
					Seat,
					TweenInfo.new(distance * Speed, Enum.EasingStyle.Linear),
					{ Position = PrevStartCFrame.Position }
				)

				while true do
					task.wait()

					if returnCondition then return end

					tweenStart:Play()
					tweenStart.Completed:Wait()
					tweenEnd:Play()
					tweenEnd.Completed:Wait()
				end
			end)

			task.spawn(function()
				if Seat.Occupant == nil then
					Seat:Destroy()
					returnCondition = true
					task.wait()
					returnCondition = false
				end
			end)
		end)()


		debounce = false
	end)


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

		if not BlockType or BlockType ~= 'MovingSeat' then return end
		InitMovingSeat(block)
	end)
end
----`