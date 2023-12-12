export const LuaCodeGlobalValueSystem = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외의 사람이
 분석, 참고, 이용하는 등 유출 행위를 금합니다.
 Copyright 2023. bean7189 All rights reserved.
]]



--// Service //--
local MessagingService = game:GetService('MessagingService')
local HttpService = game:GetService('HttpService')
local ReplicatedStorage = game:GetService('ReplicatedStorage')
----



--// Presetup //--
local guid = HttpService:GenerateGUID(false)


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
type TypeMessage = {
	receivedGUID: string,
	path: string,
	value: any
}
----



--// Constants //--
local fGlobalValueSystemReplicated = ReplicatedStorage.GlobalValueSystem
local fBindables: Folder = fGlobalValueSystemReplicated.Bindables

local Config = script.Config
local TargetFolder = Config.TargetFolder.Value
assert(TargetFolder, '데이터 감시 폴더가 지정되지 않았습니다. TargetFolder ObjectValue의 Value를 설정해주세요.')
assert(TargetFolder:IsA('Folder'), 'TargetFolder의 Value는 Folder 속성만 설정 가능합니다. 데이터 감시 폴더를 다시 지정해 주세요.')
----



--// Remotes / Bindables //--
local BEvtChangeValue: BindableEvent = fBindables.ChangeValue
----



--// Modules //--

----



--// Variables //--

----



--// Functions //--
local function GetValueParent(Parent: Folder, categoryName: string)
	assert(typeof(Parent) == 'Instance', ('Invalid argument #1 Parent. Folder expected, got %s'):format(typeof(Parent)))
	assert(Parent.ClassName == 'Folder', ('Invalid argument #1 Parent. Folder expected, got %s'):format(Parent.ClassName))

	assert(typeof(categoryName) == 'string', ('Invalid argument #2 categoryName. string expected, got %s'):format(typeof(categoryName)))

	assert(typeof(categoryName) == 'string', ('Invalid argument #3 categoryName. string expected, got %s'):format(typeof(categoryName)))


	local path = Parent:FindFirstChild(categoryName)
	if path then return path end

	local newCategory = Instance.new('Folder')
	newCategory.Parent = Parent
	newCategory.Name = categoryName
	return newCategory
end

local function GetValueNameAndParentFromFullPath(path)
	-- ReplicatedStorage 등 컨데이너명은 제외된 상태로 경로 데이터 수신
	local nameTable = string.split(path, '.')
	-- ValueBase 이름
	local valueName = nameTable[#nameTable]

	-- 첫 valueParent를 targetFolder로 설정, 이후 실제 Value의 Parent를 구하기
	local ValueParent = TargetFolder
	-- nameTable  마지막에 있는 valueName에 대한 값 제거
	table.remove(nameTable, #nameTable)
	-- 카테고리명만 있는 nameTable 순회하여 카테고리가 있으면 return, 없으면 생성 후 return
	for i, categoryName in pairs(nameTable) do
		ValueParent = GetValueParent(ValueParent, categoryName)
	end

	return valueName, ValueParent
end


local function CheckValueType(valueName: string?, value: string|number|boolean|Color3|BrickColor|Vector3|CFrame)
	if valueName then
		local isColor3 = string.find(valueName, '_Color3')
		local isBrickColor = string.find(valueName, '_BrickColor')
		local isVector3 = string.find(valueName, '_Vector3')
		local isCFrame = string.find(valueName, '_CFrame')
		local isString = typeof(value) == 'string'
		local isNumber = typeof(value) == 'number'
		local isBoolean = typeof(value) == 'boolean'

		return isColor3, isBrickColor, isVector3, isCFrame, isString, isNumber, isBoolean
	else
		local isColor3 = string.split(value, '_Color3')[1]
		local isBrickColor = string.split(value, '_BrickColor')[1]
		local isVector3 = string.split(value, '_Vector3')[1]
		local isCFrame = string.split(value, '_CFrame')[1]
		local isString = typeof(value) == 'string'
		local isNumber = typeof(value) == 'number'
		local isBoolean = typeof(value) == 'boolean'

		return isColor3, isBrickColor, isVector3, isCFrame, isString, isNumber, isBoolean
	end
end

local function CreateValue(Parent: folder, valueName: string, value: string|number|boolean|Color3|BrickColor|Vector3|CFrame)

	local isColor3, isBrickColor, isVector3, isCFrame, isString, isNumber, isBoolean = CheckValueType(valueName, value)

	local newValue = value
	local ValueBase
	if isColor3 then
		ValueBase = Instance.new('Color3Value')
		local color3 = string.split(newValue, '_Color3')[1]
		local nameTable = string.split(color3, ', ')
		newValue = Color3.new(nameTable[1], nameTable[2], nameTable[3])
	elseif isBrickColor then
		ValueBase = Instance.new('BrickColorValue')
		local brickColor = string.split(newValue, '_BrickColor')[1]
		newValue = BrickColor.new(brickColor)
	elseif isVector3 then
		ValueBase = Instance.new('Vector3Value')
		local vector3 = string.split(newValue, '_Vector3')[1]
		local nameTable = string.split(vector3, ', ')
		newValue = Vector3.new(nameTable[1], nameTable[2], nameTable[3])
	elseif isCFrame then
		ValueBase = Instance.new('CFrameValue')
		local cframe = string.split(newValue, '_CFrame')[1]
		local nameTable = string.split(cframe, ', ')
		newValue = CFrame.new(nameTable[1], nameTable[2], nameTable[3], nameTable[4], nameTable[5], nameTable[6], nameTable[7], nameTable[8], nameTable[9], nameTable[10], nameTable[11], nameTable[12])
	elseif isString then
		ValueBase = Instance.new('StringValue')
	elseif isNumber then
		ValueBase = Instance.new('NumberValue')
	elseif isBoolean then
		ValueBase = Instance.new('BoolValue')
	end
	ValueBase.Parent = Parent
	ValueBase.Name = valueName
	ValueBase.Value = newValue


	return ValueBase
end

local function GetValueBase(Parent: Folder, valueName: string, value: string|number|boolean|Color3|BrickColor|Vector3|CFrame)
	assert(Parent, 'Invalid argument #1 Parent. Folder expected, got nil')
	assert(typeof(Parent) == 'Instance', ('Invalid argument #1 Parent. Folder expected got %s'):format(typeof(Parent)))
	assert(valueName, 'Invalid argument #2 valueName. string expected, got nil.')
	assert(value ~= nil, 'Invalid argument #3 value. string|number|boolean|Color3|BrickColor|Vector3|CFrame expected, got nil')


	local ValueBase = Parent:FindFirstChild(valueName)
	if ValueBase then return ValueBase end

	ValueBase = CreateValue(Parent, valueName, value)


	return ValueBase
end


-- 존재하든, 존재하지 않든 카테고리의 특정 폴더에 있는 값을 변경하는 함수
local function ChangeValue(path: string, value: string|number|boolean|Color3|BrickColor|Vector3|CFrame)
	assert(path, 'Invalid argument #1 path. string expected, got nil')
	assert(typeof(path) == 'string', ('Invalid argument #1 path. string expected, got %s'):format(typeof(path)))

	assert(value, 'Invalid argument #2 value. string expected, got nil.')
	assert(
		typeof(value) == 'string'
			or typeof(value) == 'number'
			or typeof(value) == 'boolean',
		('Invalid argument #2 value. string|number|boolean|Color3|BrickColor|Vector3|CFrame expected, got %s')
			:format(typeof(value))
	)


	-- Value 부모 구하기
	local valueName, ValueParent = GetValueNameAndParentFromFullPath(path)
	-- Value 구하기
	local ValueBase: StringValue|NumberValue|BoolValue|Color3Value|BrickColorValue|Vector3Value|CFrameValue
		= GetValueBase(ValueParent, valueName, value)
	-- 값 설정
	local isColor3 = string.find(value, '_Color3')
	local isBrickColor = string.find(value, '_BrickColor')
	local isVector3 = string.find(value, '_Vector3')
	local isCFrame = string.find(value, '_CFrame')
	if isColor3 then
		local color3 = string.split(value, '_Color3')[1]
		local nameTable = string.split(color3, ', ')
		ValueBase.Value = Color3.new(nameTable[1], nameTable[2], nameTable[3])
	elseif isBrickColor then
		local brickColor = string.split(value, '_BrickColor')[1]
		ValueBase.Value = BrickColor.new(brickColor)
	elseif isVector3 then
		local vector3 = string.split(value, '_Vector3')[1]
		local nameTable = string.split(vector3, ', ')
		ValueBase.Value = Vector3.new(nameTable[1], nameTable[2], nameTable[3])
	elseif isCFrame then
		local vector3 = string.split(value, '_CFrame')[1]
		local nameTable = string.split(vector3, ', ')
		ValueBase.Value = CFrame.new(nameTable[1], nameTable[2], nameTable[3], nameTable[4], nameTable[5], nameTable[6], nameTable[7], nameTable[8], nameTable[9], nameTable[10], nameTable[11], nameTable[12])
	else
		ValueBase.Value = value
	end


	return ValueBase
end


local function SendMessageChangeValue(Value: StringValue|NumberValue|BoolValue|Color3Value|BrickColorValue|Vector3Value|CFrameValue)
	assert(
		Value:IsA('StringValue')
			or Value:IsA('NumberValue')
			or Value:IsA('BoolValue')
			or Value:IsA('Color3Value')
		,
		('Invalid argument #1 Value. StringValue|NumberValue|BoolValue|Color3Value|BrickColorValue|Vector3Value|CFrameValue expected, got %s.'):format(typeof(Value))
	)

	-- path를 targetFolder 내부로 축소
	local path: string = Value:GetFullName()
	local nameTable = string.split(path, '.')
	local targetFolderIndex
	for i, v in pairs(nameTable) do
		if v ~= TargetFolder.Name then continue end
		targetFolderIndex = i
	end
	for i=1, targetFolderIndex, 1 do
		table.remove(nameTable, 1)
	end
	local newPath: string = ''
	for i=1, #nameTable do
		if newPath == '' then
			newPath = nameTable[i]
		else
			newPath = newPath .. '.' .. nameTable[i]
		end
	end

	local value: string|number|boolean|Color3|BrickColor|Vector3|CFrame = tostring(Value.Value)
	if Value:IsA('Color3Value') then
		value = value..'_Color3'
	end
	if Value:IsA('BrickColorValue') then
		value = value..'_BrickColor'
	end
	if Value:IsA('Vector3Value') then
		value = value..'_Vector3'
	end
	if Value:IsA('CFrameValue') then
		value = value..'_CFrame'
	end
	local data: TypeMessage = {
		['receivedGUID'] = guid,
		['path'] = newPath,
		['value'] = value
	}
	local encoded = HttpService:JSONEncode(data)
	MessagingService:PublishAsync('ChangeValue', encoded)
end

local function OnMessageChangeValue(datas)
	local data: TypeMessage = HttpService:JSONDecode(datas.Data)
	local receivedGUID = data.receivedGUID
	local path = data.path
	local value = data.value

	assert(typeof(receivedGUID) == 'string', ('Invalid argument #1 receivedGUID. string expected, got %s'):format(typeof(receivedGUID)))
	assert(typeof(path) == 'string', ('Invalid argument #2 path. string expected, got %s'):format(typeof(path)))
	assert(value, 'Invalid argument #3 value. string|number|boolean|Color3|BrickColor|Vector3|CFrame expected, got nil')
	assert(
		typeof(value) == 'string' or
			typeof(value) == 'number' or
			typeof(value) == 'boolean',
		('Invalid argument #3 value. string|number|boolean|Color3|BrickColor|Vector3|CFrame expected, got %s.'):format(typeof(value))
	)

	-- 값 변경 중복 방지 예외 처리
	if receivedGUID == guid then return end

	local ValueBase = ChangeValue(path, value)
end
----



--// Setup //--

----



--// Main //--
MessagingService:SubscribeAsync('ChangeValue', OnMessageChangeValue)

BEvtChangeValue.Event:Connect(
	function(path: string, value: string|number|boolean|Color3|BrickColor|Vector3|CFrame)
		local ValueBase = ChangeValue(path, value)
		SendMessageChangeValue(ValueBase)
	end)
----`