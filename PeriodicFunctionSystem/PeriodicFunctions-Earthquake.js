export const LuaCodeEarthquake = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
]]



--// Services //--
local Players = game:GetService('Players')
local Debris = game:GetService('Debris')
----



--// Presetup //--

----



--// Types //--
type TypeBlockList = {
	['Block']: BasePart,
	['VisibleBlock']: BasePart,
	['InvisibleBlock']: BasePart,
	['OriginParent']: Instance,
}
----



--// Constants //--
local Config = script.Parent.Config
local RUN_TIME_MIN = Config.RunTimeMin.Value
local RUN_TIME_MAX = Config.RunTimeMax.Value
local USE_PRISMATIC_CONSTRAINT = Config.UsePrismaticConstraint.Value
local INTERVAL_TIME = Config.IntervalTime.Value
local GAP_POSITION_XZ_MIN = Config.GapPositionXZMin.Value
local GAP_POSITION_XZ_MAX = Config.GapPositionXZMax.Value
local GAP_POSITION_Y_MIN = Config.GapPositionYMin.Value
local GAP_POSITION_Y_MAX = Config.GapPositionYMax.Value
local INTENSITY = Config.Intensity.Value
----



--// Remotes / Bindables //--

----



--// Modules //--

----



--// Variables //--
local blockList = {}
local currentRunTime = 0
local targetRunTime = 0
local coroutines = {}

local fClonedBlocks
----



--// Functions //--
local function RunTimer()
	coroutines.Timer = coroutine.create(function()
		while true do
			task.wait(1)
			currentRunTime += 1
		end
	end)

	coroutine.resume(coroutines.Timer)
end

local function StopTimer()
	if coroutines.Timer then
		coroutine.close(coroutines.Timer)
		coroutines.Timer = nil
		currentRunTime = 0
	end
end


local function RunEarthquake()
	targetRunTime = math.random(RUN_TIME_MIN, RUN_TIME_MAX)
	RunTimer()


	if USE_PRISMATIC_CONSTRAINT then
		-- Clone
		fClonedBlocks = Instance.new('Folder')
		fClonedBlocks.Parent = workspace
		fClonedBlocks.Name = 'Earthquake-ClonedBlocks'
		for _, BlockInfo: TypeBlockList in ipairs(blockList) do
			BlockInfo.VisibleBlock.Anchored = false
			BlockInfo.InvisibleBlock.Anchored = true

			--print('fClonedBlocks: ', fClonedBlocks)
			--print('fClonedBlocks.Parent: ', fClonedBlocks.Parent)
			BlockInfo.InvisibleBlock.Parent = fClonedBlocks


			local Attachment0 = Instance.new('Attachment')
			Attachment0.Parent = BlockInfo.InvisibleBlock
			Attachment0.Name = 'Attachment0'
			Attachment0.WorldCFrame = BlockInfo.InvisibleBlock.CFrame
			local Attachment1 = Instance.new('Attachment')
			Attachment1.Parent = BlockInfo.VisibleBlock
			Attachment1.Name = 'Attachment1'
			Attachment1.WorldCFrame = BlockInfo.VisibleBlock.CFrame
			local PrismaticConstraint = Instance.new('PrismaticConstraint')
			PrismaticConstraint.Parent = BlockInfo.VisibleBlock
			PrismaticConstraint.Attachment0 = Attachment0
			PrismaticConstraint.Attachment1 = Attachment1
			PrismaticConstraint.ActuatorType = Enum.ActuatorType.Servo
			--PrismaticConstraint.ServoMaxForce = 10000
			PrismaticConstraint.ServoMaxForce = 5000
			PrismaticConstraint.Speed = INTENSITY
		end
	end



	task.spawn(function()
		while true do
			task.wait()


			if not USE_PRISMATIC_CONSTRAINT then
				-- 구현 방법 1: 단순 Position 설정으로 이동되는 것처럼 보이도록 구현
				for _, BlockInfo: TypeBlockList in ipairs(blockList) do
					local tempGapPosXZ = math.random(GAP_POSITION_XZ_MIN, GAP_POSITION_XZ_MAX)
					local tempGapPosY = math.random(GAP_POSITION_Y_MIN, GAP_POSITION_Y_MAX)
					local gapPosXZ = math.random(-tempGapPosXZ, tempGapPosXZ)
					local gapPosY = math.random(-tempGapPosY, tempGapPosY)

					local newCFrame = BlockInfo.Block.CFrame * CFrame.new( Vector3.new(gapPosXZ, gapPosY, gapPosXZ) )
					BlockInfo.VisibleBlock.CFrame = newCFrame
				end

			else

				-- 구현 방법 2: 파트가 물리적으로 이동되도록 구현
				for _, BlockInfo: TypeBlockList in ipairs(blockList) do
					local tempGapPosXZ = math.random(GAP_POSITION_XZ_MIN, GAP_POSITION_XZ_MAX)
					local tempGapPosY = math.random(GAP_POSITION_Y_MIN, GAP_POSITION_Y_MAX)
					local gapPosXZ = math.random(-tempGapPosXZ, tempGapPosXZ)
					local gapPosY = math.random(-tempGapPosY, tempGapPosY)

					local newCFrame = BlockInfo.Block.CFrame * CFrame.new( Vector3.new(gapPosXZ, gapPosY, gapPosXZ) )
					BlockInfo.InvisibleBlock.CFrame = newCFrame
				end


				if currentRunTime >= targetRunTime then
					StopTimer()
					for _, BlockInfo: TypeBlockList in pairs(blockList) do
						BlockInfo.VisibleBlock.CFrame = BlockInfo.Block.CFrame
						if USE_PRISMATIC_CONSTRAINT then
							BlockInfo.VisibleBlock.Anchored = true
						end
					end
					
					if USE_PRISMATIC_CONSTRAINT then
						for _, BlockInfo: TypeBlockList in pairs(blockList) do
							BlockInfo.Block.Parent = BlockInfo.OriginParent
							BlockInfo.VisibleBlock:Destroy()
							BlockInfo.VisibleBlock = nil
							BlockInfo.InvisibleBlock:Destroy()
							BlockInfo.InvisibleBlock = nil
							BlockInfo.OriginParent = nil
						end
					end

					fClonedBlocks:Destroy()
					fClonedBlocks = nil
					blockList = nil
					blockList = {}

					return
				end
			end


			task.wait(INTERVAL_TIME)
		end

	end)
end


function module.Execute()
	--for _, player: Player in pairs(Players:GetPlayers()) do
	--	local message = Instance.new('Message')
	--	message.Parent = player:WaitForChild('PlayerGui')
	--	message.Text = script.Name
	--	Debris:AddItem(message, 5)
	--end


	for _, Block: BasePart in pairs(workspace:GetDescendants()) do
		if not Block:IsA('BasePart') then continue end
		local nameTable = string.split(Block.Name, '-')
		local isBlock = nameTable[1] == 'Block'
		if not isBlock then continue end


		local info: TypeBlockList = {}
		info.Block = Block
		info.OriginParent = Block.Parent
		info.VisibleBlock = Block:Clone()
		info.InvisibleBlock = Block:Clone()
		table.insert(blockList, info)

		Block.Parent = script
		info.VisibleBlock.Parent = info.OriginParent
		info.InvisibleBlock.Transparency = 1
		info.InvisibleBlock.CanCollide = false
		info.InvisibleBlock.CanTouch = false
	end


	RunEarthquake()
end

function module.Cancel()
	currentRunTime = targetRunTime
end
----




----



--// Main //--

----



`