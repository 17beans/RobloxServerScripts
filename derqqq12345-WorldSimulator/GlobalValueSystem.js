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
type TypeMessage = {
	receivedGUID: string,
	path: string,
	value: any
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
	-- ValueInstance 이름
	local valueName = nameTable[#nameTable]

	-- 첫 valueParent를 targetFolder로 설정, 이후 실제 Value의 Parent를 구하기
	local ValueParent = targetFolder
	-- nameTable  마지막에 있는 valueName에 대한 값 제거
	table.remove(nameTable, #nameTable)
	-- 카테고리명만 있는 nameTable 순회하여 카테고리가 있으면 return, 없으면 생성 후 return
	for i, categoryName in pairs(nameTable) do
		ValueParent = GetValueParent(ValueParent, categoryName)
	end

	return valueName, ValueParent
end


local function CheckValueType(value: string|number|boolean)
	local isBool = ( (value == true) or (value == false) ) and true or false
	local isNumber = tonumber(value)

	return isBool, isNumber
end

local function CreateValue(Parent: folder, valueName: string, value: string|number|boolean)
	local isBool, isNumber = CheckValueType(value)
	local newValue
	if isBool then
		newValue = Instance.new('BoolValue')
	elseif isNumber then
		newValue = Instance.new('NumberValue')
	else
		newValue = Instance.new('StringValue')
	end
	newValue.Parent = Parent
	newValue.Name = valueName
	newValue.Value = value


	return newValue
end

local function GetValueInstance(Parent: Folder, valueName: string, value: string|number|boolean)
	assert(Parent, 'Invalid argument #1 Parent. Folder expected, got nil')
	assert(typeof(Parent) == 'Instance', ('Invalid argument #1 Parent. Folder expected got %s'):format(typeof(Parent)))
	assert(valueName, 'Invalid argument #2 valueName. string expected, got nil.')
	assert(value ~= nil, 'Invalid argument #3 value. string|number|boolean expected, got nil')


	local ValueInstance = Parent:FindFirstChild(valueName)
	if ValueInstance then return ValueInstance end

	ValueInstance = CreateValue(Parent, valueName, value)


	return ValueInstance
end


-- 존재하든, 존재하지 않든 카테고리의 특정 폴더에 있는 값을 변경하는 함수
local function ChangeValue(path: string, value: string|number|boolean)
	assert(path, 'Invalid argument #1 path. string expected, got nil')
	assert(typeof(path) == 'string', ('Invalid argument #1 path. string expected, got %s'):format(typeof(path)))

	assert(value, 'Invalid argument #2 value. string expected, got nil.')
	assert(
		typeof(value) == 'string' or typeof(value) == 'number' or typeof(value) == 'boolean',
		('Invalid argument #2 value. string|number|boolean expected, got %s')
			:format(typeof(value))
	)


	-- Value 부모 구하기
	local valueName, ValueParent = GetValueNameAndParentFromFullPath(path)
	-- Value 구하기
	local ValueInstance: StringValue|NumberValue|BoolValue
		= GetValueInstance(ValueParent, valueName, value)
	-- 값 설정
	ValueInstance.Value = value


	return ValueInstance
end


local function SendMessageChangeValue(Value: StringValue|NumberValue|BoolValue)
	local value = Value.Value
	assert(
		typeof(value) == 'string'
			or typeof(value) == 'number'
			or typeof(value) == 'boolean'
		,
		('Invalid argument #1 Value. StringValue|NumberValue|BoolValue expected, got %s.'):format(typeof(value))
	)

	local path: string = Value:GetFullName()

	-- path를 targetFolder 내부로 축소
	local nameTable = string.split(targetFolder.CountryA.Level['경제 레벨']:GetFullName(), '.')
	local targetFolderIndex
	for i, v in pairs(nameTable) do
		if v ~= targetFolder.Name then continue end
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

	local value: string|number|boolean = tostring(value)
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
	assert(value, 'Invalid argument #3 value. string|number|boolean expected, got nil')
	assert(
		typeof(value) == 'string' or
			typeof(value) == 'number' or
			typeof(value) == 'boolean',
		('Invalid argument #3 value. string|number|boolean expected, got %s.'):format(typeof(value))
	)

	-- 값 변경 중복 방지 예외 처리
	if receivedGUID == guid then return end

	local ValueInstance = ChangeValue(path, value)
end
----



--// Setup //--

----



--// Main //--
MessagingService:SubscribeAsync('ChangeValue', OnMessageChangeValue)

BEvtChangeValue.Event:Connect(
	function(path: string, value: string|number|boolean)
		local ValueInstance = ChangeValue(path, value)
		SendMessageChangeValue(ValueInstance)
	end)
----`