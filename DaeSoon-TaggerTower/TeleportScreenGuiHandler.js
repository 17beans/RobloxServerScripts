export const LuaCodeTeleportScreenGuiHandler = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외의 사람이
 분석, 참고, 이용하는 등 유출 행위를 금합니다.
 Copyright 2023. bean7189 All rights reserved.
]]



--// Services //--
local ReplicatedStorage = game:GetService('ReplicatedStorage')
local TweenService = game:GetService('TweenService')
----



--// Presetup //--
local gui = script.Parent
repeat task.wait()
	LocalPlayer = gui:FindFirstAncestorOfClass('Player')
until LocalPlayer
----



--// Types //--

----



--// Constants //--
local fBlackScreen = gui['화면 가리게']

local tweenFadeIn = TweenService:Create(
	fBlackScreen,
	TweenInfo.new(1, Enum.EasingStyle.Linear, Enum.EasingDirection.In),
	{ BackgroundTransparency = 0 }
)

local tweenFadeOut = TweenService:Create(
	fBlackScreen,
	TweenInfo.new(1, Enum.EasingStyle.Linear, Enum.EasingDirection.Out),
	{ BackgroundTransparency = 1 }
)
----



--// Remotes / Bindables //--
local BEvtTeleportScreenOn: BindableEvent = ReplicatedStorage:WaitForChild('TeleportScreenOn', 5)
----



--// Modules //--

----



--// Variables //--

----



--// Functions //--
local function LockCharacter(character: Model)
	local Humanoid = character:FindFirstChildOfClass('Humanoid')
	Humanoid.WalkSpeed = 0
	Humanoid.JumpHeight = 0
end

local function UnLockCharacter(character: Model)
	local Humanoid = character:FindFirstChildOfClass('Humanoid')
	Humanoid.WalkSpeed = 16
	Humanoid.JumpHeight = 7.2
end
----



--// Setup //--

----



--// Main //--
BEvtTeleportScreenOn.Event:Connect(function(player: Player, partDestination: Part)
	if not player then return end
	if not partDestination then return end
	if player ~= LocalPlayer then return end
	local character = LocalPlayer.Character
	if not character then return end

	tweenFadeIn:Play()
	LockCharacter(character)
	tweenFadeIn.Completed:Wait()
	character:PivotTo(partDestination.CFrame * CFrame.new(Vector3.new(0, 4, 0)))
	UnLockCharacter(character)
	tweenFadeOut:Play()
end)
----`