export const LuaCodeGlobalValueSystem = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
]]



--// Service //--
local MessagingService = game:GetService('MessagingService')
local HttpService = game:GetService('HttpService')
local ReplicatedStorage = game:GetService('ReplicatedStorage')
----



--// Presetup //--
local guid = HttpService:GenerateGUID(false)
local GUID = Instance.new('StringValue')
GUID.Parent = workspace
GUID.Name = 'GUID'
GUID.Value = guid


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
type MessageValues = {
	receivedGUID: string,
	categoryNameA: string|nil,
	categoryNameB: string|nil,
	valueName: string,
	value: any
}

type TypeData = {
	['guid']: string,
	['name']: string,
	['pos']: {
		['X']: number,
		['Y']: number,
		['Z']: number
	},
	['lkv']: {
		['X']: number,
		['Y']: number,
		['Z']: number
	},
	['siz']: {
		['X']: number,
		['Y']: number,
		['Z']: number
	},
	['color']: {
		['R']: number,
		['G']: number,
		['B']: number
	},
	['Anchored']: boolean,
	['cancollide']: boolean,
	['canquery']: boolean,
	['cantouch']: boolean,
}
----



--// Constants //--
local fGlobalValueSystemReplicated = ReplicatedStorage.GlobalValueSystem
local fBindables: Folder = fGlobalValueSystemReplicated.Bindables

local targetFolder = script.TargetFolder.Value
assert(targetFolder, '값 폴더를 지정하지 않았습니다. 값 폴더를 지정해주세요. (No value folder was specified. Please set the value folder)', targetFolder)
assert(typeof(targetFolder) == 'Instance', ('Invalid targetFolder. Folder expected, got %s'):format(typeof(targetFolder)))
----



--// Remotes / Bindables //--
local BEvtChangeValue: BindableEvent = fBindables.ChangeValue
----



--// Modules //--

----



--// Variables //--

----



--// Functions //--
local function CreateCategory(CategoryName: string)
	assert(CategoryName, 'Invalid argument #1 CategoryName. string expected, got nil.')
	assert(typeof(CategoryName) == 'string', ('Invalid argument #1 CategoryName. string expected, got %s'):format(typeof(CategoryName)))

	local fCategory: Folder = targetFolder:FindFirstChild(CategoryName)
	if not fCategory then
		fCategory = Instance.new('Folder')
		fCategory.Parent = targetFolder
		fCategory.Name = CategoryName
	end

	return fCategory
end

local function CheckValueType(value: string|number|boolean)
	local isBool = ( (value == true) or (value == false) ) and true or false
	local isNumber = tonumber(value)

	return isBool, isNumber
end

local function CreateValue(parent: folder, valueName: string, value: string|number|boolean)
	assert(parent, 'Invalid argument #1 parent. Folder expected, got nil')
	assert(typeof(parent) == 'Instance', ('Invalid argument #1 parent. Folder expected got %s'):format(typeof(parent)))
	assert(valueName, 'Invalid argument #2 valueName. string expected, got nil.')
	assert(value ~= nil, 'Invalid argument #3 value. string|number|boolean expected, got nil')

	local isBool, isNumber = CheckValueType(value)
	local newValue
	if isBool then
		newValue = Instance.new('BoolValue')
	elseif isNumber then
		newValue = Instance.new('NumberValue')
	else
		newValue = Instance.new('StringValue')
	end
	newValue.Parent = parent
	newValue.Name = valueName
	newValue.Value = value
	return newValue
end


-- 존재하든, 존재하지 않든 카테고리의 특정 폴더에 있는 값을 변경하는 함수
local function ChangeValue(categoryNameA: string|nil, categoryNameB: string|nil, valueName: string, value: string|number|boolean)
	assert(typeof(categoryNameA) == 'string' or typeof(categoryNameA) == nil, ('Invalid argument #1 categoryNameA. string or nil expected, got %s'):format(typeof(categoryNameA)))
	assert(typeof(categoryNameA) == 'string', ('Invalid argument #1 categoryNameA. string expected, got %s'):format(typeof(categoryNameA)))

	assert(typeof(categoryNameB) == 'string' or typeof(categoryNameB) == nil, ('Invalid argument #2 categoryNameB. string or nil expected, got %s'):format(typeof(categoryNameB)))
	assert(typeof(categoryNameB) == 'string', ('Invalid argument #2 categoryNameB. string expected, got %s'):format(typeof(categoryNameB)))

	assert(valueName, 'Invalid argument #3 valueName. string expected, got nil.')
	assert(typeof(valueName) == 'string', ('Invalid argument #3 valueName. string expected, got %s'):format(typeof(valueName)))
	assert(value ~= nil, 'Invalid argument #4 value. string expected, got nil.')
	assert(
		typeof(value) == 'string' or typeof(value) == 'number' or typeof(value) == 'boolean',
		('Invalid argument #4 value. string|number|boolean expected, got %s')
			:format(typeof(value))
	)

	----// 개체 탐색 및 값 설정 //----
	-- parent: targetFolder | categoryNameA | categoryNameB
	local function SetValue(parent: Instance, valueName: string, value: string|number|boolean)
		assert(parent, ('Invalid argument #1 parent, nil'))
		assert(typeof(parent) == 'Instance', ('Invalid argument #1 parent type, %s'):format(typeof(parent)))

		assert(valueName, 'Invalid argument #2 valueName, nil')
		assert(typeof(valueName) == 'string', ('Invalid argument #2 valueName type, %s'):format(typeof(valueName)))

		assert(value ~= nil, 'Invalid argument #3 value, nil')
		assert(typeof(value) == 'string' or typeof(value) == 'number' or typeof(value) == 'boolean', ('Invalid argument #3 value type, %s'):format(typeof(value)))


		-- Value 탐색
		local vTarget = parent:FindFirstChild(valueName)
		-- 없으면 생성, Value 설정
		if not vTarget then vTarget = CreateValue(parent, valueName, value) end
		-- 있으면 Value 설정
		vTarget.Value = value

		return vTarget
	end

	local function SetCategory(categoryName)
		-- 카테고리 폴더 탐색
		local fCategory = targetFolder:FindFirstChild(categoryName)
		-- 없으면 생성
		if not fCategory then fCategory = CreateCategory(categoryName) end

		return fCategory
	end


	local fCategory: Folder
	local vTarget: ValueBase
	if categoryNameA and not categoryNameB then
		-- categoryNameA만 설정
		fCategory = SetCategory(categoryNameA)

	elseif not categoryNameA and categoryNameB then
		-- categoryNameB만 설정
		fCategory = SetCategory(categoryNameB)

	elseif categoryNameA and categoryNameB then
		-- categoryNameA, categoryNameB 둘 다 설정. categoryNameB는 categoryNameA의 child
		-- 카테고리A 설정
		local fCategoryA = targetFolder:FindFirstChild(categoryNameA)
		if not fCategoryA then
			fCategoryA = CreateCategory(categoryNameA)
		end
		fCategory = fCategoryA
		-- 카테고리B 설정
		local fCategoryB = fCategoryA:FindFirstChild(categoryNameB)
		if not fCategoryB then
			fCategoryB = CreateCategory(categoryNameB)
			fCategoryB.Parent = fCategoryA
		end
		fCategory = fCategoryB
	end

	-- 카테고리 설정 마친 후 값 설정
	vTarget = SetValue(fCategory, valueName, value)
	--------

	--print('==========')
	--print('ChangeValue function complete.')
	--print(fCategory)
	--print(vTarget.Value)


	return vTarget
end


local function SendMessageChangeValue(Value: StringValue|NumberValue|IntValue|BoolValue)
	assert(Value, 'Invalid argument #1. StringValue|NumberValue|IntValue|BoolValue expected, got nil.')

	-- 부모가 targetFolder인지 확인
	-- parent = categoryB
	-- parent.parent = categoryA
	-- parent.parent.parent = targetFolder
	local fCategoryA: Folder
	local fCategoryB: Folder
	if Value.Parent.Parent == targetFolder then
		fCategoryA = Value.Parent

	elseif Value.Parent.Parent.Parent == targetFolder then
		fCategoryA = Value.Parent.Parent
		fCategoryB = Value.Parent

	else
		-- 카테고리 정상 범위 벗어남
		error('Value parent error')
		return

	end

	local categoryNameA = fCategoryA.Name
	local categoryNameB = fCategoryB and fCategoryB.Name or nil
	local value = tostring(Value.Value)
	local data: MessageValues= {
		['receivedGUID'] = guid,
		['categoryNameA'] = fCategoryA.Name,
		['categoryNameB'] = fCategoryB.Name,
		['valueName'] = Value.Name,
		['value'] = value
	}
	local encoded = HttpService:JSONEncode(data)
	MessagingService:PublishAsync('ChangeValue', encoded)
end

local function OnMessageChangeValue(datas)
	--for _, player in game.Players:GetPlayers() do
	--	local Message = Instance.new('Message')
	--	Message.Parent = player.PlayerGui
	--	Message.Text = 'OnMessageChangeValue start'
	--	game.Debris:AddItem(Message, 3)
	--end
	local data: MessageValues = HttpService:JSONDecode(datas.Data)
	local receivedGUID = data.receivedGUID
	local categoryNameA = data.categoryNameA
	local categoryNameB = data.categoryNameB
	local valueName = data.valueName
	local value = data.value
	--print('==========')
	--print(receivedGUID)
	--print(categoryNameA)
	--print(categoryNameB)
	--print(valueName)
	--print(value)
	--print('==========')
	assert(receivedGUID, 'Invalid argument #1 receivedGUID. string expected, got nil')
	assert(typeof(receivedGUID) == 'string', ('Invalid argument #1 receivedGUID. string expected, got %s'):format(typeof(receivedGUID)))
	assert(typeof(categoryNameA) == 'string' or typeof(categoryNameA) == nil, ('Invalid argument #2 categoryNameA. string|nil expected, got %s.'):format(typeof(categoryNameA)))
	assert(typeof(categoryNameB) == 'string' or typeof(categoryNameB) == nil, ('Invalid argument #3 categoryNameB. string|nil expected, got %s.'):format(typeof(categoryNameB)))
	assert(valueName, 'Invalid argument #4 valueName. string expected, got nil')
	assert(typeof(valueName) == 'string', ('Invalid argument #4 valueName. string expected, got %s'):format(typeof(valueName)))
	assert(value ~= nil, 'Invalid argument #5 value. string|number|boolean expected, got nil.')
	assert(
		typeof(value) == 'string' or
			typeof(value) == 'number' or
			typeof(value) == 'boolean',
		('Invalid argument #5 Value. string|number|boolean expected, got %s.'):format(typeof(value))
	)

	-- 중복 제거
	if receivedGUID == guid then return end

	local vTarget = ChangeValue(categoryNameA, categoryNameB, valueName, value)
	--for _, player in game.Players:GetPlayers() do
	--	local Message = Instance.new('Message')
	--	Message.Parent = player.PlayerGui
	--	Message.Text = 'OnMessageChangeValue end'
	--	game.Debris:AddItem(Message, 3)
	--end
end
----



--// Setup //--

----



--// Main //--
MessagingService:SubscribeAsync('ChangeValue', OnMessageChangeValue)
BEvtChangeValue.Event:Connect(function(categoryNameA, categoryNameB, valueName, value)
	local vTarget = ChangeValue(categoryNameA, categoryNameB, valueName, value)
	SendMessageChangeValue(vTarget)
end)


----// 테스트용 파트 동기화 코드 //----
local function SendMessageOnPartCreated(partData)
	--print('send data')
	local encoded = HttpService:JSONEncode(partData)
	local decoded = HttpService:JSONDecode(encoded)

	local s, r
	local maxCount = 5
	local count = 1
	repeat
		s, r = pcall(function()
			MessagingService:PublishAsync('CreatePart', encoded)
		end)
		count += 1
	until s or count >= maxCount
	if not s then warn('[GlobalValueSystem] Create part error: ', r) end
end

local function OnMessageCreatePart(Data: {Data: TypeData})
	local data = HttpService:JSONDecode(Data.Data)
	--print('data: ', data)
	if data.guid == guid then return end

	local name, pos, lkv, siz, color, Anchored, cancollide, canquery, cantouch = data.name, data.pos, data.lkv, data.siz, data.color, data.Anchored, data.cancollide, data.canquery, data.cantouch

	local newPart = Instance.new('Part')
	newPart.Parent = workspace

	newPart.Name = name
	newPart.CFrame = CFrame.new(
		Vector3.new(pos.X, pos.Y, pos.Z),
		Vector3.new(lkv.X, lkv.Y, lkv.Z)
	)
	newPart.Size = Vector3.new(siz.X, siz.Y, siz.Z)
	newPart.Color = Color3.new(color.R, color.G, color.B)
	newPart.Anchored = Anchored
	newPart.CanCollide = cancollide
	newPart.CanQuery = canquery
	newPart.CanTouch = cantouch
end

MessagingService:SubscribeAsync('CreatePart', OnMessageCreatePart)
workspace.ChildAdded:Connect(function(child)
	if not child:IsA('Part') then return end

	local data: TypeData = {
		['guid'] = guid,
		['name'] = child.Name,
		['pos'] = {
			['X'] = child.CFrame.Position.X,
			['Y'] = child.CFrame.Position.Y,
			['Z'] = child.CFrame.Position.Z
		},
		['lkv'] = {
			['X'] = child.CFrame.LookVector.X,
			['Y'] = child.CFrame.LookVector.Y,
			['Z'] = child.CFrame.LookVector.Z},
		['siz'] = {
			['X'] = child.Size.X,
			['Y'] = child.Size.Y,
			['Z'] = child.Size.Z
		},
		['color'] = {
			['R'] = child.Color.R,
			['G'] = child.Color.G,
			['B'] = child.Color.B
		},
		['cancollide'] = child.CanCollide,
		['canquery'] = child.CanQuery,
		['cantouch'] = child.CanTouch,
	}
	SendMessageOnPartCreated(data)
end)
--------
----`